
interface SummaryResult {
  summary_text: string;
}

interface TranslationResult {
  translation_text: string;
}

// 1. Model Tóm tắt (Tiếng Anh)
const SUMMARIZATION_MODEL = "facebook/bart-large-cnn";

// 2. Model Dịch thuật (Anh -> Việt)
const TRANSLATION_MODEL = "Helsinki-NLP/opus-mt-en-vi";

// Helper để gọi HF API chung
const callHuggingFaceAPI = async (modelId: string, input: string, params?: any) => {
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.HF_TOKEN : undefined;
    const controller = new AbortController();
    
    // Tăng timeout lên 60s vì model Free Tier cần thời gian khởi động (Cold Start)
    const timeoutId = setTimeout(() => controller.abort(), 60000); 

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    
    if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
    }

    try {
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${modelId}`,
            {
                headers,
                method: "POST",
                body: JSON.stringify({ 
                    inputs: input,
                    parameters: params,
                    options: {
                        wait_for_model: true, // QUAN TRỌNG: Bắt buộc API đợi model load xong mới trả kết quả
                        use_cache: false 
                    }
                }),
                signal: controller.signal
            }
        );
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};

// Fallback logic: Trích xuất câu đơn giản (Offline)
const summarizeLocal = (text: string, errorMsg?: string): string => {
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
    
    let summary = "";
    if (sentences.length <= 3) {
        summary = text;
    } else {
        const first = sentences[0];
        const last = sentences[sentences.length - 1];
        const middle = sentences[Math.floor(sentences.length / 2)];
        summary = `${first.trim()} ... ${middle.trim()} ... ${last.trim()}`;
    }

    return `(Chế độ Offline - Không thể kết nối AI): ${summary}. \n\n[Lỗi kỹ thuật: ${errorMsg || 'Unknown Error'}]`;
}

export const summarizeText = async (text: string): Promise<string | null> => {
  const cleanText = text.trim();
  if (!cleanText) return null;
  
  // Nếu quá ngắn (< 10 từ), không tóm tắt, chỉ dịch thử (hoặc trả về luôn)
  if (cleanText.split(' ').length < 10) return cleanText;

  try {
    // --- BƯỚC 1: TÓM TẮT (Tiếng Anh) ---
    // Model BART giới hạn input khoảng 1024 token, cắt bớt nếu quá dài để tránh lỗi 422
    const truncatedText = cleanText.length > 3000 ? cleanText.substring(0, 3000) : cleanText;

    let englishSummary = "";
    
    try {
        const summaryResponse = await callHuggingFaceAPI(SUMMARIZATION_MODEL, truncatedText, {
            max_length: 150,
            min_length: 40,
            do_sample: false
        });

        if (Array.isArray(summaryResponse) && summaryResponse.length > 0 && summaryResponse[0].summary_text) {
            englishSummary = summaryResponse[0].summary_text;
        } else if (typeof summaryResponse === 'object' && summaryResponse.summary_text) {
             englishSummary = summaryResponse.summary_text;
        } else {
            // Nếu API tóm tắt trả về format lạ (đôi khi trả về list rỗng), dùng fallback
             console.warn("Summary API returned unexpected format", summaryResponse);
             englishSummary = cleanText.substring(0, 500) + "..."; // Fallback: Dùng 500 ký tự đầu để dịch
        }
    } catch (summError: any) {
        console.warn("Summarization step failed:", summError);
        // Nếu tóm tắt lỗi, ta vẫn cố gắng dịch đoạn văn bản gốc (cắt ngắn)
        englishSummary = cleanText.substring(0, 1000); 
    }

    // --- BƯỚC 2: DỊCH SANG TIẾNG VIỆT ---
    try {
        const translationResponse = await callHuggingFaceAPI(TRANSLATION_MODEL, englishSummary);
        
        if (Array.isArray(translationResponse) && translationResponse.length > 0 && translationResponse[0].translation_text) {
             return translationResponse[0].translation_text;
        }
        
        // Nếu dịch lỗi nhưng tóm tắt thành công, trả về tiếng Anh kèm thông báo
        return `(Chưa thể dịch sang Tiếng Việt) Summary: ${englishSummary}`;

    } catch (translationError: any) {
        console.warn("Translation step failed:", translationError);
        return `(Lỗi dịch thuật - Kết quả Tiếng Anh): ${englishSummary}`;
    }

  } catch (error: any) {
    console.error("Full pipeline failed:", error);
    return summarizeLocal(cleanText, error.message);
  }
};
