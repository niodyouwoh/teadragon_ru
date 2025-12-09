import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const stmt = db.prepare(`
      SELECT o.*, u.username, u.name as user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `)
    const orders = stmt.all()

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Ошибка получения заказов:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { orderId, status } = await request.json()

    const stmt = db.prepare("UPDATE orders SET status = ? WHERE id = ?")
    stmt.run(status, orderId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка обновления заказа:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
