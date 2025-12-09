import { NextRequest, NextResponse } from "next/server"
import db, { getUserLevel, getDiscount } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId, items, deliveryMethod, deliveryAddress, customerName, customerPhone, notes, bonusUsed } =
      await request.json()

    // Получаем пользователя
    const userStmt = db.prepare("SELECT * FROM users WHERE id = ?")
    const user = userStmt.get(userId) as any

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Проверяем бонусы
    if (bonusUsed > user.bonus_points) {
      return NextResponse.json({ error: "Недостаточно бонусов" }, { status: 400 })
    }

    // Рассчитываем сумму
    let subtotal = 0
    for (const item of items) {
      subtotal += item.price * item.quantity
    }

    // Применяем скидку по уровню
    const discountPercent = getDiscount(user.level)
    const discountAmount = (subtotal * discountPercent) / 100

    // Вычитаем бонусы
    const total = subtotal - discountAmount - bonusUsed

    // Начисляем новые бонусы (5% от суммы после скидки)
    const bonusEarned = Math.floor((subtotal - discountAmount) * 0.05)

    // Создаем заказ
    const orderStmt = db.prepare(`
      INSERT INTO orders (user_id, total, bonus_used, bonus_earned, discount_percent, status, payment_method, payment_phone, 
                          delivery_address, delivery_method, customer_name, customer_phone, notes)
      VALUES (?, ?, ?, ?, ?, 'pending', 'sbp', '+79307221110', ?, ?, ?, ?, ?)
    `)

    const orderResult = orderStmt.run(
      userId,
      total,
      bonusUsed,
      bonusEarned,
      discountPercent,
      deliveryAddress,
      deliveryMethod,
      customerName,
      customerPhone,
      notes || null
    )

    const orderId = orderResult.lastInsertRowid

    // Добавляем товары в заказ
    const itemStmt = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
      VALUES (?, ?, ?, ?, ?)
    `)

    for (const item of items) {
      itemStmt.run(orderId, item.id, item.name, item.quantity, item.price)
    }

    // Обновляем пользователя
    const newBonusPoints = user.bonus_points - bonusUsed + bonusEarned
    const newTotalSpent = user.total_spent + total
    const newLevel = getUserLevel(newTotalSpent)

    const updateUserStmt = db.prepare(`
      UPDATE users 
      SET bonus_points = ?, total_spent = ?, level = ?
      WHERE id = ?
    `)

    updateUserStmt.run(newBonusPoints, newTotalSpent, newLevel, userId)

    return NextResponse.json({
      success: true,
      orderId,
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

    const stmt = db.prepare(`
      SELECT o.*, 
             GROUP_CONCAT(oi.product_name || ' x' || oi.quantity) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `)

    const orders = stmt.all(userId)

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Ошибка получения заказов:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
