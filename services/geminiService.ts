
// Use correct imports as per Google GenAI SDK guidelines
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, AgentResponse, NewsItem } from "../types";
import { fetchNewsFallbackRaw } from "./hfService";

/**
 * Initialize AI client using the direct environment variable as per guidelines.
 */
const getAIClient = () => {
  if (!process.env.GEMINI_API_KEY) throw new Error("API Key missing");
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * AI NEWS AGENT: Chỉ tìm kiếm tin tức trong lĩnh vực Crypto
 */
export const fetchCryptoNews = async (query?: string): Promise<AgentResponse & { isFallback?: boolean }> => {
  const ai = getAIClient();
  const model = "gemini-3-flash-preview";

  try {
    if (query && query.trim() !== "" && query !== "ALL") {
      // Prompt thắt chặt phạm vi tìm kiếm chỉ trong Crypto
      const searchPrompt = `Bạn là một chuyên gia phân tích tin tức Crypto. 
      Nhiệm vụ: Tìm kiếm 5-8 tin tức mới nhất về từ khóa: "${query}".
      
      QUY TẮC NGHIÊM NGẶT:
      1. CHỈ TRẢ VỀ tin tức nếu từ khóa liên quan đến: Tiền điện tử, Blockchain, Web3, DeFi, NFT, Đào coin, Quy định pháp lý về crypto, hoặc các dự án crypto cụ thể.
      2. Nếu từ khóa KHÔNG LIÊN QUAN đến Crypto (ví dụ: nấu ăn, du lịch, chính trị không liên quan crypto...), hãy trả về kết quả rỗng (không có dòng tin nào).
      3. Viết tiêu đề và tóm tắt bằng tiếng Việt chuyên nghiệp.
      4. Phân tích Sentiment (Tích cực/Tiêu cực/Trung lập).`;

      const response = await ai.models.generateContent({
        model: model,
        contents: searchPrompt,
        config: { 
          tools: [{ googleSearch: {} }],
          temperature: 0.1 // Giảm độ sáng tạo để tăng độ chính xác
        },
      });

      const rawText = response.text || "";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      // Nếu AI trả về nội dung nhưng không có nguồn thực tế hoặc nội dung quá ngắn, coi như không tìm thấy
      if (rawText.length < 50 || groundingChunks.length === 0) {
        return { news: [], sources: [], isFallback: false };
      }

      const newsLines = rawText.split('\n').filter(line => line.trim().length > 20);
      const sources = groundingChunks.map((chunk: any) => ({
        title: chunk.web?.title || "Nguồn tin Crypto",
        uri: chunk.web?.uri || "#"
      }));

      const news = newsLines.slice(0, 8).map((line, index) => ({
        title: line.split(':')[0]?.replace(/^\d+\.\s*/, '') || "Tin tức Thị trường",
        summary: line,
        source: sources[index]?.title || "Crypto Analysis",
        time: "Mới cập nhật",
        sentiment: line.includes("Tích cực") ? "Tích cực" : line.includes("Tiêu cực") ? "Tiêu cực" : "Trung lập",
        url: sources[index]?.uri || "#"
      }));

      return { news, sources, isFallback: false };
    }

    // TRƯỜNG HỢP 2: TIN TỨC TỔNG HỢP (Luôn mặc định là Crypto từ Feed)
    const rawData = await fetchNewsFallbackRaw("ALL");
    if (!rawData || rawData.length === 0) return { news: [], sources: [], isFallback: true };

    const agentPrompt = `Dịch và tóm tắt tin tức crypto sau sang tiếng Việt: ${JSON.stringify(rawData)}.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: agentPrompt,
      config: { 
        temperature: 0.1, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            news: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  source: { type: Type.STRING },
                  time: { type: Type.STRING },
                  url: { type: Type.STRING },
                  sentiment: { type: Type.STRING }
                }
              }
            }
          }
        }
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
    return { news: [], sources: [], isFallback: true };
  }
};

export const askCryptoTutor = async (currentMessage: string, history: ChatMessage[] = []): Promise<string> => {
  try {
    const ai = getAIClient();
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: { systemInstruction: "Bạn là chuyên gia Crypto2u. Chỉ trả lời các câu hỏi liên quan đến lĩnh vực tiền điện tử, blockchain và tài chính số bằng tiếng Việt. Nếu người dùng hỏi ngoài lĩnh vực này, hãy lịch sự từ chối và hướng dẫn họ hỏi về Crypto." }
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
        contents: `Tóm tắt nội dung crypto sau bằng tiếng Việt: ${text}`
    });
    return response.text || null;
  } catch (e) { return null; }
};

export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string | null> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: `A crypto-themed artistic image: ${prompt}` }] },
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
