
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, AgentResponse, NewsItem } from "../types";
import { fetchNewsFallbackRaw } from "./hfService";

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  return new GoogleGenAI({ apiKey });
};

/**
 * AI NEWS AGENT: Xử lý dữ liệu từ các nguồn tin tức hàng đầu thế giới
 */
export const fetchCryptoNews = async (query?: string): Promise<AgentResponse & { isFallback?: boolean }> => {
  try {
    // 1. Lấy dữ liệu tin tức nóng nhất từ hệ thống tin tức toàn cầu (CryptoCompare/CryptoPanic)
    const rawData = await fetchNewsFallbackRaw(query || "ALL");
    
    if (!rawData || rawData.length === 0) {
        return { news: [], sources: [], isFallback: true };
    }

    // 2. Sử dụng Gemini Flash làm Agent xử lý ngôn ngữ và phân tích
    const ai = getAIClient();
    const model = "gemini-3-flash-preview";

    const agentPrompt = `
      VAI TRÒ: Bạn là "Crypto2u Intel Agent" - Chuyên gia phân tích tin tức thị trường.
      NHIỆM VỤ: Dịch, tóm tắt và phân tích danh sách tin tức sau đây sang tiếng Việt.

      DỮ LIỆU ĐẦU VÀO:
      ${JSON.stringify(rawData)}

      YÊU CẦU XỬ LÝ:
      1. Ngôn ngữ: Dịch Tiêu đề (title) sang tiếng Việt thu hút.
      2. Tóm tắt: Viết lại nội dung (summary) thành 2-3 câu súc tích bằng tiếng Việt chuyên ngành.
      3. Đánh giá (Sentiment): Xác định tin này là "Tích cực", "Tiêu cực" hoặc "Trung lập".
      4. Thời gian: Chuyển đổi timestamp thành định dạng dễ đọc như "15 phút trước".

      TRẢ VỀ ĐỊNH DẠNG JSON:
      {
        "news": [
          { "title": "...", "summary": "...", "source": "...", "time": "...", "url": "...", "sentiment": "Tích cực | Tiêu cực | Trung lập" }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: agentPrompt,
      config: { 
        temperature: 0.2,
        responseMimeType: "application/json"
      },
    });

    const newsData = JSON.parse(response.text || '{"news":[]}');

    return { 
      news: newsData.news || [], 
      sources: rawData.map(n => ({ title: n.source, uri: n.url })),
      isFallback: false 
    };

  } catch (error: any) {
    console.error("News Agent Error:", error);
    // Trả về dữ liệu thô nếu AI gặp sự cố
    const rawData = await fetchNewsFallbackRaw(query || "ALL");
    return { 
        news: rawData.map(n => ({ ...n, summary: n.body, time: "Vừa cập nhật", sentiment: "Trung lập" })), 
        sources: [], 
        isFallback: true 
    };
  }
};

export const askCryptoTutor = async (currentMessage: string, history: ChatMessage[] = []): Promise<string> => {
  try {
    const ai = getAIClient();
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: { systemInstruction: "Bạn là chuyên gia Crypto2u. Trả lời bằng tiếng Việt." }
    });
    const response = await chat.sendMessage({ message: currentMessage });
    return response.text || "Tôi gặp sự cố xử lý.";
  } catch (error) { return "Bot đang bận."; }
};

export const summarizeText = async (text: string): Promise<string | null> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Tóm tắt tiếng Việt: ${text}`
    });
    return response.text || null;
  } catch (e) { return null; }
};

export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string | null> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1", imageSize: size } },
    });
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) { return null; }
};
