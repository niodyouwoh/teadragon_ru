import { NextRequest, NextResponse } from "next/server"
import { getAllOrders, updateOrderStatus } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const orders = await getAllOrders()
    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Ошибка получения заказов:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { orderId, status } = await request.json()
    await updateOrderStatus(orderId, status)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка обновления заказа:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
