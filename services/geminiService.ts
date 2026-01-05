
import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private chat: Chat | null = null;

  constructor() {
    try {
      // 安全地获取 API Key
      const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
      
      if (!apiKey) {
        console.warn("API_KEY is missing. GeminiService will not function correctly.");
        return;
      }

      this.ai = new GoogleGenAI({ apiKey });
      this.chat = this.ai.models.createChat({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
        },
      });
    } catch (error) {
      console.error("Failed to initialize GeminiService:", error);
    }
  }

  async *sendMessageStream(message: string) {
    if (!this.chat) {
      yield "助手初始化失败，请检查 API 配置。";
      return;
    }

    try {
      const stream = await this.chat.sendMessageStream({ message });
      for await (const chunk of stream) {
        yield chunk.text;
      }
    } catch (error: any) {
      console.error("Gemini Streaming Error:", error);
      yield `连接错误: ${error.message || '未知错误'}`;
    }
  }
}
