
// Use correct imports as per Google GenAI SDK guidelines
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, AgentResponse, NewsItem } from "../types";
import { fetchNewsFallbackRaw } from "./hfService";

/**
 * Initialize AI client using the direct environment variable as per guidelines.
 */
const getAIClient = () => {
  if (!process.env.GEMINI_API_KEY) throw new Error("API Key missing");
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

/**
 * AI NEWS AGENT: Tối ưu cho thương hiệu Crypto2u
 */
export const fetchCryptoNews = async (query?: string): Promise<AgentResponse & { isFallback?: boolean }> => {
  const ai = getAIClient();
  const model = "gemini-3-flash-preview";

  try {
    if (query && query.trim() !== "" && query !== "ALL") {
      const searchPrompt = `Bạn là Crypto2u AI News Agent - hệ thống phân tích tin tức độc quyền của Crypto2u.
      NHIỆM VỤ: Tìm kiếm, tóm tắt và phân tích sắc thái của 10-12 tin tức mới nhất về: "${query}".
      
      QUY TẮC:
      1. Tập trung vào các dự án Blockchain, DeFi, NFT, Layer 1/2 và các dự án mới (Monad, Berachain...).
      2. Nếu là dự án công nghệ blockchain hoặc tài chính số, hãy coi đó là HỢP LỆ.
      
      YÊU CẦU ĐẦU RA:
      - Liệt kê tối đa 10-12 tin tức theo định dạng: [Tiêu đề]: [Tóm tắt ngắn gọn].
      - Phân tích sắc thái (Sentiment): Tích cực, Tiêu cực hoặc Trung lập.
      - Ngôn ngữ: Tiếng Việt.`;

      const response = await ai.models.generateContent({
        model: model,
        contents: searchPrompt,
        config: { 
          tools: [{ googleSearch: {} }],
          temperature: 0.2
        },
      });

      const rawText = response.text || "";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      if (groundingChunks.length === 0 && rawText.length < 100) {
        return { news: [], sources: [], isFallback: false };
      }

      const newsLines = rawText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 30 && (line.includes(':') || line.includes('-')));

      const sources = groundingChunks.map((chunk: any) => ({
        title: chunk.web?.title || "Nguồn tin Crypto2u",
        uri: chunk.web?.uri || "#"
      }));

      const news = newsLines.slice(0, 12).map((line, index) => {
        const parts = line.split(':');
        const title = parts[0]?.replace(/^(\d+\.|\*|-)\s*/, '').trim() || "Cập nhật thị trường";
        const summary = parts.slice(1).join(':').trim() || line;
        
        return {
          title: title,
          summary: summary,
          source: sources[index]?.title || "Crypto2u Analytics",
          time: "Vừa cập nhật",
          sentiment: line.toLowerCase().includes("tích cực") ? "Tích cực" : 
                     line.toLowerCase().includes("tiêu cực") ? "Tiêu cực" : "Trung lập",
          url: sources[index]?.uri || "#"
        };
      });

      return { news, sources, isFallback: news.length === 0 };
    }

    // FALLBACK
    const rawData = await fetchNewsFallbackRaw("ALL");
    if (!rawData || rawData.length === 0) return { news: [], sources: [], isFallback: true };

    const agentPrompt = `Bạn là Crypto2u AI. Hãy tóm tắt 10 tin tức crypto sau sang tiếng Việt chuyên nghiệp: ${JSON.stringify(rawData)}.`;

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
    return { news: [], sources: [], isFallback: true };
  }
};

export const askCryptoTutor = async (currentMessage: string, history: ChatMessage[] = []): Promise<string> => {
  try {
    const ai = getAIClient();
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: { systemInstruction: "Bạn là Crypto2u AI - Chuyên gia hỗ trợ kiến thức tiền điện tử. Trả lời các câu hỏi về crypto, blockchain, airdrop. Phong cách thân thiện, chính xác, khách quan." }
    });
    const response = await chat.sendMessage({ message: currentMessage });
    return response.text || "Xin lỗi, tôi gặp sự cố nhỏ.";
  } catch (error) { return "Bot đang bận."; }
};

export const summarizeText = async (text: string): Promise<string | null> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Bạn là trợ lý Crypto2u. Tóm tắt nội dung crypto sau bằng tiếng Việt: ${text}`
    });
    return response.text || null;
  } catch (e) { return null; }
};

export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string | null> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: `A professional Crypto2u tech illustration: ${prompt}` }] },
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
