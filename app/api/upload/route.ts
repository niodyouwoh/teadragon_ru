import { NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: "ru-1",
  endpoint: "https://s3.twcstorage.ru",
  credentials: {
    accessKeyId: "COIYK2SG8X3MH8K3MYA",
    secretAccessKey: "OUFPnIud8H1Gk7nwLxZD4hjDjP0bBuIWq1RgV4fGSw",
  },
})

const BUCKET_NAME = "d0bb84a6-35788b9e-6ba9-47ec-a1a8-68e9ea3ac4e9"
const FOLDER_NAME = "teadragonimages"

export async function POST(request: NextRequest) {
  try {
    console.log("📤 Начало загрузки изображения...")
    
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof Blob)) {
      console.error("❌ Файл не найден в FormData")
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 })
    }

    // Получаем имя файла
    const fileName = file instanceof File ? file.name : "image.jpg"
    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
    const key = `${FOLDER_NAME}/${timestamp}-${sanitizedFileName}`

    console.log(`📁 Имя файла: ${fileName}`)
    console.log(`🔑 S3 Key: ${key}`)
    console.log(`📦 Размер: ${file.size} bytes`)
    console.log(`🎨 Тип: ${file.type}`)

    // Конвертируем в Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log(`💾 Buffer создан, размер: ${buffer.length} bytes`)

    // Загружаем в S3 (без ACL, так как может не поддерживаться)
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type || "image/jpeg",
    })

    console.log("☁️ Отправка в S3...")
    const response = await s3Client.send(command)
    console.log("✅ Загружено в S3:", response)

    const imageUrl = `https://s3.twcstorage.ru/${BUCKET_NAME}/${key}`
    console.log(`🌐 URL изображения: ${imageUrl}`)

    return NextResponse.json({ imageUrl, success: true })
  } catch (error: any) {
    console.error("❌ Ошибка загрузки изображения:", error)
    console.error("Stack:", error.stack)
    return NextResponse.json(
      { 
        error: `Ошибка загрузки: ${error.message || "Неизвестная ошибка"}`,
        details: error.toString()
      },
      { status: 500 }
    )
  }
}
