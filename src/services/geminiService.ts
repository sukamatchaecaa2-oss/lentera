import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getDailyQuote(isDiligent: boolean, isOftenLate: boolean): Promise<string> {
  const status = isDiligent ? "rajin dan berprestasi" : isOftenLate ? "sering terlambat/kurang disiplin" : "perlu peningkatan";
  
  const systemInstruction = 
    `Kamu adalah motivator di aplikasi Lentera. Tugasmu adalah memberikan kutipan harian (Daily Quote) yang singkat, padat, dan sangat menginspirasi untuk siswa SMA. ` +
    `Status siswa saat ini: ${status}. ` +
    `${isDiligent ? "Berikan pujian dan dorongan untuk tetap konsisten." : isOftenLate ? "Berikan kata-kata motivasi yang tegas namun ramah tentang pentingnya kedisiplinan dan manajemen waktu." : "Berikan semangat umum untuk belajar."} ` +
    `Gunakan bahasa Indonesia yang modern dan menyentuh hati. Maksimal 2 kalimat.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Berikan satu kutipan harian untuk saya hari ini.",
      config: {
        systemInstruction,
      },
    });

    return response.text || "Teruslah belajar, hari esok adalah milik mereka yang mempersiapkan hari ini.";
  } catch (error) {
    console.error("Gemini Error (Quote):", error);
    return "Keberhasilan bukanlah akhir, kegagalan bukanlah hal yang fatal: keberanian untuk melanjutkanlah yang penting.";
  }
}

export async function askTutor(question: string): Promise<AIResponse> {
  const systemInstruction = 
    "Kamu adalah 'Tutor Sebaya' di aplikasi Lentera. " +
    "Jawab dengan gaya bahasa yang santai, mudah dimengerti anak sekolah, dan berikan langkah-langkah penyelesaiannya (step-by-step). " +
    "Output harus dalam format JSON yang berisi 'jawaban' (string) dan 'saran_topik_terkait' (array of strings).";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            jawaban: {
              type: Type.STRING,
              description: "Jawaban tutor untuk pertanyaan siswa.",
            },
            saran_topik_terkait: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Daftar topik terkait untuk dipelajari lebih lanjut.",
            },
          },
          required: ["jawaban", "saran_topik_terkait"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    return JSON.parse(resultText) as AIResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      jawaban: "Maaf, sepertinya Tutor AI sedang beristirahat. Coba tanya lagi nanti ya!",
      saran_topik_terkait: ["Matematika", "Fisika", "Kimia"],
    };
  }
}
