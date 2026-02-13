
import { GoogleGenAI } from "@google/genai";
import { Commission } from "../types";

// Always initialize the client using process.env.API_KEY as per guidelines.
// This ensures that the application assumes the key is pre-configured and accessible.

export const generateClientUpdate = async (commission: Commission): Promise<string> => {
  // Creating a new instance right before the call as recommended for updated state access.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // Directly call ai.models.generateContent with the appropriate model for basic text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `請以「暹羅的賠錢生意」店主身份為 ${commission.clientName} 寫一則親切的進度回報，語氣要可愛一點，可以使用顏文字。目前狀態：${commission.status}。委託項目：${commission.title}。`,
    });
    
    // Access the .text property directly instead of calling it as a method.
    return response.text || "無法產生。";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "AI 服務暫時無法使用。";
  }
};

export const suggestWorkPlan = async (commission: Commission): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `針對委託 "${commission.title}" (類型: ${commission.type}) 提供 3 個具體的製作下一步建議或是需要注意的細節，請條列式回答。`,
    });
    
    return response.text || "無法產生。";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "AI 服務暫時無法使用。";
  }
};
