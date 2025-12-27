
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, AgentResponse, NewsItem } from "../types";
import { articles, glossary } from "../data/content";

export const askCryptoTutor = async (
  currentMessage: string, 
  history: ChatMessage[] = []
): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "Lỗi cấu hình: Chưa tìm thấy API Key. Vui lòng kiểm tra cài đặt môi trường.";
  }

  // Tối ưu hóa dữ liệu ngữ cảnh (Context) để tránh gửi payload quá lớn
  const glossaryContext = glossary.slice(0, 30).map(g => `- ${g.term}: ${g.definition}`).join('\n');
  const articlesContext = articles.map(a => `- Bài viết "${a.title}": ${a.description}`).join('\n');

  const MAX_RETRIES = 2;
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      // Fix: Create instance right before use
      const ai = new GoogleGenAI({ apiKey });
      // Fix: Use supported Gemini 3 model for text tasks
      const model = "gemini-3-flash-preview";
      
      const systemInstruction = `
      Bạn là "Crypto2u AI", trợ lý AI chuyên về Crypto.
      
      DỮ LIỆU WEBSITE:
      [TỪ ĐIỂN]
      ${glossaryContext}
      
      [BÀI VIẾT]
      ${articlesContext}

      YÊU CẦU:
      1. Trả lời ngắn gọn (dưới 150 từ), thân thiện, dùng tiếng Việt.
      2. Nếu câu hỏi có trong dữ liệu trên, hãy dùng nó để trả lời.
      3. Không đưa ra lời khuyên đầu tư tài chính (NFA).
      `;

      const chat = ai.chats.create({
        model: model,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
        history: history
      });

      const response = await chat.sendMessage({ message: currentMessage });

      // Fix: Directly access .text property
      return response.text || "Xin lỗi, tôi không thể trả lời ngay lúc này.";
    } catch (error: any) {
      console.error(`Gemini Chat Error (Attempt ${retryCount + 1}):`, error);
      
      retryCount++;
      if (retryCount >= MAX_RETRIES) {
        return "Hiện tại tôi đang gặp sự cố kết nối. Vui lòng thử lại sau giây lát.";
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return "Không thể kết nối với AI.";
};

export const fetchCryptoNews = async (query?: string): Promise<AgentResponse> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return { news: [], sources: [] };
  }

  try {
    // Fix: Create instance right before use
    const ai = new GoogleGenAI({ apiKey });
    // Fix: Use supported Gemini 3 model for search grounding
    const model = "gemini-3-flash-preview";

    let searchPrompt = "Tìm kiếm các tin tức Crypto nổi bật mới nhất trong 24h qua từ các nguồn uy tín quốc tế (CoinDesk, TheBlock, Bloomberg, Cointelegraph...).";
    if (query) {
      searchPrompt = `Tìm kiếm các tin tức mới nhất về "${query}" trong thế giới Crypto trong 24h qua.`;
    }

    const prompt = `
      ${searchPrompt}
      Tổng hợp thành danh sách tối đa 6 tin quan trọng nhất.
      
      Yêu cầu định dạng JSON chính xác:
      {
        "news": [
          {
            "title": "Tiêu đề dịch sang tiếng Việt",
            "summary": "Tóm tắt nội dung chính (khoảng 20-30 từ) bằng tiếng Việt",
            "source": "Tên nguồn (VD: CoinDesk)",
            "time": "Thời gian (VD: 2 giờ trước)"
          }
        ]
      }
      
      Chỉ trả về JSON, không thêm văn bản dẫn dắt.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Fix: Directly access .text property
    const text = response.text || "{}";
    let newsData: { news: NewsItem[] } = { news: [] };

    try {
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
          const jsonStr = cleanText.substring(firstBrace, lastBrace + 1);
          newsData = JSON.parse(jsonStr);
      } else {
          newsData = JSON.parse(cleanText);
      }
    } catch (e) {
      console.warn("Failed to parse JSON from news response. Raw text:", text);
    }

    const sources: { title: string; uri: string }[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Source",
            uri: chunk.web.uri || "#"
          });
        }
      });
    }

    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values()).slice(0, 5);

    return {
      news: newsData.news || [],
      sources: uniqueSources
    };

  } catch (error) {
    console.error("Gemini News Fetch Error:", error);
    return { news: [], sources: [] };
  }
};

export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return null;
  }

  try {
    // Fix: Create instance right before use
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-pro-image-preview";

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1",
            imageSize: size
        }
      }
    });

    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    return null;
  }
};

export const summarizeText = async (text: string): Promise<string | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return "Lỗi: Chưa cấu hình API Key.";
  }
  if (!text.trim()) return null;

  try {
    // Fix: Create instance right before use
    const ai = new GoogleGenAI({ apiKey });
    // Fix: Use supported Gemini 3 model for summarization
    const model = "gemini-3-flash-preview";

    const prompt = `
      Bạn là một chuyên gia phân tích thị trường Crypto.
      Nhiệm vụ: Tóm tắt nội dung văn bản dưới đây và dịch sang Tiếng Việt (nếu văn bản gốc là tiếng nước ngoài).
      
      Yêu cầu:
      - Tóm tắt ngắn gọn, tập trung vào các thông tin quan trọng nhất (Key insights).
      - Văn phong chuyên nghiệp, dễ hiểu cho nhà đầu tư Việt Nam.
      - Trình bày dạng liệt kê (bullet points) nếu cần thiết.
      
      Văn bản cần xử lý:
      "${text}"
    `;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt
    });

    // Fix: Directly access .text property
    return response.text;
  } catch (error) {
    console.error("Gemini Summarize Error:", error);
    return "Xin lỗi, AI đang bận hoặc gặp sự cố kết nối. Vui lòng thử lại sau.";
  }
};
