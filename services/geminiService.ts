import { GoogleGenAI } from "@google/genai";
import { Commission } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  return apiKey ? new GoogleGenAI({ apiKey }) : null;
};

export const generateClientUpdate = async (commission: Commission): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "缺少 API Key。";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `請以「暹羅的賠錢生意」店主身份為 ${commission.clientName} 寫一則親切的進度回報，語氣要可愛一點，可以使用顏文字。目前狀態：${commission.status}。委託項目：${commission.title}。`,
  });
  return response.text || "無法產生。";
};

export const suggestWorkPlan = async (commission: Commission): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "缺少 API Key。";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `針對委託 "${commission.title}" (類型: ${commission.type}) 提供 3 個具體的製作下一步建議或是需要注意的細節，請條列式回答。`,
  });
  return response.text || "無法產生。";
};