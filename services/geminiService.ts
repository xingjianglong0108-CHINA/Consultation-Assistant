
import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.chat = this.ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Keep it precise for clinical data
      },
    });
  }

  async sendMessage(message: string) {
    try {
      const response = await this.chat.sendMessage({ message });
      return response.text || "抱歉，我暂时无法获取回复，请稍后再试。";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "连接助手时出现错误。请检查您的网络连接。";
    }
  }

  async *sendMessageStream(message: string) {
    try {
      const stream = await this.chat.sendMessageStream({ message });
      for await (const chunk of stream) {
        yield chunk.text;
      }
    } catch (error) {
      console.error("Gemini Streaming Error:", error);
      yield "流式传输过程中出现错误。";
    }
  }
}
