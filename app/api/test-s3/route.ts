import { NextRequest, NextResponse } from "next/server"
import { S3Client, ListBucketsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"

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

export async function GET(request: NextRequest) {
  try {
    console.log("🧪 Тестирование подключения к S3...")

    // Тест 1: Список объектов в папке
    console.log("📂 Получение списка файлов...")
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: FOLDER_NAME,
      MaxKeys: 10,
    })

    const listResponse = await s3Client.send(listCommand)
    console.log("✅ Список получен:", listResponse.Contents?.length || 0, "файлов")

    const files = listResponse.Contents?.map((item) => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
      url: `https://s3.twcstorage.ru/${BUCKET_NAME}/${item.Key}`,
    }))

    return NextResponse.json({
      success: true,
      message: "S3 подключение работает!",
      bucket: BUCKET_NAME,
      folder: FOLDER_NAME,
      filesCount: files?.length || 0,
      files: files || [],
      endpoint: "https://s3.twcstorage.ru",
    })
  } catch (error: any) {
    console.error("❌ Ошибка тестирования S3:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString(),
        stack: error.stack,
      },
      { status: 500 }
    )
  }
}
