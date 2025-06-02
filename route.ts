import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const query = formData.get("query") as string
    const file = formData.get("file") as File | null

    const payload: any = { message: query }

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer())
      payload.file = {
        name: file.name,
        size: file.size,
        content: buffer.toString("base64"),
      }
    }

    const backendRes = await fetch("https://your-backend-url.onrender.com/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await backendRes.json()

    return NextResponse.json({ response: data.output || data.response, success: true })
  } catch (err) {
    console.error("GPT API error:", err)
    return NextResponse.json({ error: "Failed to get GPT response" }, { status: 500 })
  }
}