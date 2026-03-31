import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { note } = await req.json();
    
    if (!note || note.trim() === "") {
      return NextResponse.json({ tags: [] });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Thiếu GEMINI_API_KEY");

    const prompt = `Trích xuất các yêu cầu đặc biệt từ ghi chú giao hàng sau thành một mảng chuỗi (tối đa 3-4 chữ/tag). 
    Ghi chú: "${note}"
    Ví dụ: ["Ngoài giờ HC", "Gọi trước"]
    Nếu không có yêu cầu đặc biệt, trả về mảng rỗng [].`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json", // Ép trả về JSON chuẩn, cấm nói nhảm
        }
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("Lỗi từ Google API:", errData);
      throw new Error("Lỗi gọi Google API");
    }

    const data = await res.json();
    const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    
    const tags = JSON.parse(outputText);
    return NextResponse.json({ tags: Array.isArray(tags) ? tags : [] });
  } catch (error: any) {
    // In lỗi đỏ rực ra Terminal để anh em mình dễ bắt mạch
    console.error("====== LỖI AI ANALYZE NOTE ======\n", error.message);
    return NextResponse.json({ tags: [] }); 
  }
}