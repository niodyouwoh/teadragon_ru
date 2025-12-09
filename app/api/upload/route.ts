import { NextRequest, NextResponse } from "next/server"
import { uploadImage } from "@/lib/s3"

export async function POST(request: NextRequest) {
  try {
    console.log("📤 Начало загрузки изображения на S3...")
    
    // Проверка переменных окружения
    const s3Config = {
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      bucket: process.env.S3_BUCKET,
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY ? "***" + process.env.S3_SECRET_KEY.slice(-4) : "NOT SET",
    }
    console.log("🔧 S3 Config:", s3Config)
    
    if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) {
      console.error("❌ S3 переменные окружения не установлены!")
      return NextResponse.json({ 
        error: "S3 не настроен. Проверьте переменные окружения в Vercel.",
        config: s3Config
      }, { status: 500 })
    }
    
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
    console.log(`🎨 Тип: ${file.type}`)

    const imageUrl = await uploadImage(file, fileName)
    
    console.log(`✅ Изображение загружено: ${imageUrl}`)

    return NextResponse.json({ imageUrl, success: true })
  } catch (error: any) {
    console.error("❌ Ошибка загрузки изображения:", error)
    console.error("Stack:", error.stack)
    
    // Детальная информация об ошибке
    const errorInfo = {
      message: error.message,
      name: error.name,
      code: error.Code || error.code,
      statusCode: error.$metadata?.httpStatusCode,
      requestId: error.$metadata?.requestId,
    }
    
    console.error("Error details:", errorInfo)
    
    return NextResponse.json(
      { 
        error: `Ошибка загрузки: ${error.message || "Неизвестная ошибка"}`,
        details: errorInfo,
        hint: error.Code === "InvalidAccessKeyId" 
          ? "Проверьте S3_ACCESS_KEY и S3_SECRET_KEY в Vercel Environment Variables"
          : "Проверьте логи Vercel для подробностей"
      },
      { status: 500 }
    )
  }
}
