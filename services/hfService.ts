
/**
 * Lấy tin tức thô từ CryptoCompare API (Public & CORS-friendly)
 */
export const fetchNewsFallbackRaw = async (category: string = "ALL") => {
    try {
        const url = `https://min-api.cryptocompare.com/data/v2/news/?lang=EN${category !== 'ALL' ? `&categories=${category}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("CryptoCompare Error");
        const data = await res.json();
        
        return data.Data.slice(0, 8).map((item: any) => ({
            title: item.title,
            body: item.body.substring(0, 400),
            source: item.source_info.name,
            published_on: item.published_on,
            url: item.url
        }));
    } catch (error) {
        console.error("Fetch Raw News Error:", error);
        return [];
    }
};

/**
 * AI AGENT từ Hugging Face (Sử dụng mô hình mã nguồn mở Mistral)
 * Lưu ý: API này có thể yêu cầu HF_TOKEN. Ở đây chúng ta sẽ thử dùng API công khai
 * hoặc hướng dẫn cách tích hợp nếu người dùng có token.
 */
export const askHuggingFace = async (message: string): Promise<string> => {
    try {
        // Sử dụng mô hình Mistral-7B-Instruct-v0.2 (Mã nguồn mở, hiệu suất cao)
        const model = "mistralai/Mistral-7B-Instruct-v0.2";
        const url = `https://api-inference.huggingface.co/models/${model}`;
        
        // Cấu trúc prompt dành cho Agent Crypto tiếng Việt
        const systemPrompt = `[INST] Bạn là một chuyên gia hướng dẫn Crypto tại Crypto2u Academy. 
        Hãy trả lời câu hỏi sau bằng tiếng Việt một cách dễ hiểu, thân thiện và chuyên nghiệp. 
        Không đưa ra lời khuyên đầu tư tài chính. 
        Câu hỏi: ${message} [/INST]`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Nếu bạn có Hugging Face Token, hãy thêm vào đây:
                // "Authorization": `Bearer ${process.env.HF_TOKEN}` 
            },
            body: JSON.stringify({
                inputs: systemPrompt,
                parameters: {
                    max_new_tokens: 500,
                    temperature: 0.7,
                    return_full_text: false
                }
            }),
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return "AI Agent từ Hugging Face yêu cầu xác thực. Đang chuyển sang chế độ dự phòng...";
            }
            throw new Error("Hugging Face API Error");
        }

        const data = await response.json();
        // Hugging Face trả về một mảng kết quả
        return data[0]?.generated_text || "Tôi không nhận được phản hồi từ Agent.";

    } catch (error) {
        console.error("Hugging Face Agent Error:", error);
        return "Sự cố kết nối với AI Agent mã nguồn mở. Vui lòng thử lại sau.";
    }
};
