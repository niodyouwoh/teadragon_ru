import { NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password, name, phone } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Логин и пароль обязательны" }, { status: 400 })
    }

    const user = registerUser(username, password, name, phone)

    if (!user) {
      return NextResponse.json({ error: "Пользователь с таким логином уже существует" }, { status: 400 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Ошибка регистрации:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
