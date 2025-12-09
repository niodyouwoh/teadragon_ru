import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    console.log("📤 Локальная загрузка изображения...")

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 })
    }

    const fileName = file instanceof File ? file.name : "image.jpg"
    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
    const newFileName = `${timestamp}-${sanitizedFileName}`

    // Путь к папке uploads в public
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    const filePath = path.join(uploadsDir, newFileName)

    console.log(`📁 Сохранение в: ${filePath}`)

    // Создаем папку если не существует
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      console.log("Папка уже существует или создана")
    }

    // Конвертируем в Buffer и сохраняем
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    const imageUrl = `/uploads/${newFileName}`
    console.log(`✅ Файл сохранен: ${imageUrl}`)

    return NextResponse.json({ imageUrl, success: true })
  } catch (error: any) {
    console.error("❌ Ошибка локальной загрузки:", error)
    return NextResponse.json(
      {
        error: `Ошибка загрузки: ${error.message}`,
        details: error.toString(),
      },
      { status: 500 }
    )
  }
}
