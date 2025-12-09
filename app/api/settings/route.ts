import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    if (typeof window !== "undefined") {
      return NextResponse.json({ error: "Server only" }, { status: 500 })
    }

    const stmt = db.prepare("SELECT * FROM site_settings")
    const settings = stmt.all() as any[]

    // Преобразуем в объект
    const settingsObj: any = {}
    settings.forEach((s) => {
      settingsObj[s.key] = s.value
    })

    return NextResponse.json({ settings: settingsObj })
  } catch (error) {
    console.error("Ошибка получения настроек:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (typeof window !== "undefined") {
      return NextResponse.json({ error: "Server only" }, { status: 500 })
    }

    const { key, value } = await request.json()

    const stmt = db.prepare(`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP
    `)

    stmt.run(key, value, value)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка сохранения настройки:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (typeof window !== "undefined") {
      return NextResponse.json({ error: "Server only" }, { status: 500 })
    }

    const settings = await request.json()

    const stmt = db.prepare(`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP
    `)

    for (const [key, value] of Object.entries(settings)) {
      stmt.run(key, value, value)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка сохранения настроек:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
