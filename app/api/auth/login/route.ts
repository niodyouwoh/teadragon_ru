import { NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 })
    }

    const user = loginUser(username, password)

    if (!user) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Ошибка входа:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
