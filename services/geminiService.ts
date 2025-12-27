
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
 * AI NEWS AGENT: Thông minh hơn trong việc nhận diện dự án Crypto
 */
export const fetchCryptoNews = async (query?: string): Promise<AgentResponse & { isFallback?: boolean }> => {
  const ai = getAIClient();
  const model = "gemini-3-flash-preview";

  try {
    if (query && query.trim() !== "" && query !== "ALL") {
      // Prompt được tinh chỉnh để nhận diện cả các dự án mới nổi (Monad, Berachain, etc.)
      const searchPrompt = `Bạn là một chuyên gia phân tích thị trường Crypto toàn cầu.
      NHIỆM VỤ: Tìm kiếm và tóm tắt 5-8 tin tức mới nhất về: "${query}".
      
      QUY TẮC NHẬN DIỆN LĨNH VỰC:
      1. Chấp nhận các từ khóa liên quan đến: Bitcoin, Altcoins, DeFi, NFT, Layer 1/2/3, Web3, Blockchain, Mining, GameFi, và TẤT CẢ các tên dự án blockchain mới (ví dụ: Monad, Berachain, Celestia, Movement, etc.).
      2. Nếu từ khóa là một dự án công nghệ blockchain hoặc tài chính số, hãy coi đó là HỢP LỆ.
      3. Chỉ từ chối các chủ đề hoàn toàn không liên quan (ví dụ: "cách nấu ăn", "thời trang trẻ em", "bóng đá thế giới").
      
      YÊU CẦU ĐẦU RA:
      - Liệt kê các tin tức theo định dạng: [Tiêu đề]: [Tóm tắt ngắn gọn].
      - Phân tích sắc thái (Sentiment): Tích cực, Tiêu cực hoặc Trung lập.
      - Ngôn ngữ: Tiếng Việt.`;

      const response = await ai.models.generateContent({
        model: model,
        contents: searchPrompt,
        config: { 
          tools: [{ googleSearch: {} }],
          temperature: 0.2 // Tăng nhẹ độ sáng tạo để AI linh hoạt hơn trong nhận diện
        },
      });

      const rawText = response.text || "";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      // Nếu không có nguồn dẫn hoặc kết quả quá sơ sài, AI có thể đã từ chối hoặc không tìm thấy
      if (groundingChunks.length === 0 && rawText.length < 100) {
        return { news: [], sources: [], isFallback: false };
      }

      // Tách dòng tin tức thông minh hơn
      const newsLines = rawText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 30 && (line.includes(':') || line.includes('-')));

      const sources = groundingChunks.map((chunk: any) => ({
        title: chunk.web?.title || "Nguồn tin thị trường",
        uri: chunk.web?.uri || "#"
      }));

      const news = newsLines.slice(0, 8).map((line, index) => {
        const parts = line.split(':');
        const title = parts[0]?.replace(/^(\d+\.|\*|-)\s*/, '').trim() || "Cập nhật thị trường";
        const summary = parts.slice(1).join(':').trim() || line;
        
        return {
          title: title,
          summary: summary,
          source: sources[index]?.title || "Crypto Analytics",
          time: "Mới cập nhật",
          sentiment: line.toLowerCase().includes("tích cực") ? "Tích cực" : 
                     line.toLowerCase().includes("tiêu cực") ? "Tiêu cực" : "Trung lập",
          url: sources[index]?.uri || "#"
        };
      });

      return { news, sources, isFallback: news.length === 0 };
    }

    // FALLBACK: Tin tức tổng hợp nếu không có query
    const rawData = await fetchNewsFallbackRaw("ALL");
    if (!rawData || rawData.length === 0) return { news: [], sources: [], isFallback: true };

    const agentPrompt = `Tóm tắt các tin tức crypto sau sang tiếng Việt chuyên nghiệp: ${JSON.stringify(rawData)}.`;

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
      config: { systemInstruction: "Bạn là chuyên gia Crypto2u. Trả lời các câu hỏi về crypto, blockchain, airdrop, và các dự án mới (như Monad, Berachain). Nếu người dùng hỏi ngoài ngành, hãy lịch sự từ chối." }
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
      contents: { parts: [{ text: `A professional crypto technology illustration: ${prompt}` }] },
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
