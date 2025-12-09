import { NextRequest, NextResponse } from "next/server"
import { loginAdmin } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 })
    }

    const admin = loginAdmin(username, password)

    if (!admin) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 })
    }

    return NextResponse.json({ admin })
  } catch (error) {
    console.error("Ошибка входа админа:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
