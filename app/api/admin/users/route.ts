import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const stmt = db.prepare("SELECT * FROM users ORDER BY created_at DESC")
    const users = stmt.all()

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Ошибка получения пользователей:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
