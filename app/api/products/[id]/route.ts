import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const stmt = db.prepare("SELECT * FROM products WHERE id = ?")
    const product = stmt.get(params.id)

    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Ошибка получения товара:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
