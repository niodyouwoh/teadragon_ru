import { NextRequest, NextResponse } from "next/server"
import { uploadImage } from "@/lib/s3"

export async function POST(request: NextRequest) {
  try {
    console.log("📤 Начало загрузки изображения на S3...")
    
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      console.error("❌ Файл не найден в FormData")
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 })
    }

    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const fileName = `${timestamp}-${sanitizedFileName}`

    console.log(`📁 Загрузка файла: ${fileName}`)
    console.log(`📦 Размер: ${file.size} bytes`)

    const imageUrl = await uploadImage(file, fileName)
    
    console.log(`✅ Изображение загружено: ${imageUrl}`)

    return NextResponse.json({ imageUrl, success: true })
  } catch (error: any) {
    console.error("❌ Ошибка загрузки изображения:", error)
    return NextResponse.json(
      { 
        error: `Ошибка загрузки: ${error.message || "Неизвестная ошибка"}`,
        details: error.toString()
      },
      { status: 500 }
    )
  }
}
