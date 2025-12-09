import { NextRequest, NextResponse } from "next/server"
import { getAllSettings, setSetting } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const settings = await getAllSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Ошибка получения настроек:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { key, value } = await request.json()
    await setSetting(key, value)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка сохранения настройки:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settings = await request.json()

    for (const [key, value] of Object.entries(settings)) {
      await setSetting(key, value as string)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка сохранения настроек:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
