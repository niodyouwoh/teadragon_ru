import { NextRequest, NextResponse } from "next/server"
import { getAllUsers } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsers()
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Ошибка получения пользователей:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
