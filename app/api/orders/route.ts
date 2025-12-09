import { NextRequest, NextResponse } from "next/server"
import { getUserById, createOrder, updateUserBonusPoints, updateUserTotalSpent, getOrdersByUserId, getUserLevel, getDiscount } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId, items, deliveryMethod, deliveryAddress, customerName, customerPhone, notes, bonusUsed } =
      await request.json()

    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    if (bonusUsed > user.bonus_points) {
      return NextResponse.json({ error: "Недостаточно бонусов" }, { status: 400 })
    }

    let subtotal = 0
    for (const item of items) {
      subtotal += item.price * item.quantity
    }

    const discountPercent = getDiscount(getUserLevel(user.total_spent))
    const discountAmount = (subtotal * discountPercent) / 100
    const total = subtotal - discountAmount - bonusUsed
    const bonusEarned = Math.floor((subtotal - discountAmount) * 0.05)

    const order = await createOrder({
      user_id: userId,
      total,
      bonus_used: bonusUsed,
      bonus_earned: bonusEarned,
      payment_phone: "+79307221110",
      items: items.map((item: any) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    })

    const newBonusPoints = user.bonus_points - bonusUsed + bonusEarned
    await updateUserBonusPoints(userId, newBonusPoints)
    await updateUserTotalSpent(userId, total)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      total,
      bonusEarned,
      paymentPhone: "+79307221110",
    })
  } catch (error) {
    console.error("Ошибка создания заказа:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "ID пользователя не указан" }, { status: 400 })
    }

    const orders = await getOrdersByUserId(parseInt(userId))
    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Ошибка получения заказов:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
