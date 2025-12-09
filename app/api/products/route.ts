import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let query = "SELECT * FROM products WHERE in_stock = 1"
    const params: any[] = []

    if (category && category !== "all") {
      query += " AND category = ?"
      params.push(category)
    }

    query += " ORDER BY created_at DESC"

    const stmt = db.prepare(query)
    const products = stmt.all(...params)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Ошибка получения товаров:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = await request.json()

    const stmt = db.prepare(`
      INSERT INTO products (id, name, name_zh, category, price, old_price, weight, description, origin, year, image, in_stock, is_new, is_bestseller)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      product.id,
      product.name,
      product.nameZh || "",
      product.category,
      product.price,
      product.oldPrice || null,
      product.weight,
      product.description,
      product.origin,
      product.year || null,
      product.image,
      product.inStock ? 1 : 0,
      product.isNew ? 1 : 0,
      product.isBestseller ? 1 : 0
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка создания товара:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const product = await request.json()

    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, name_zh = ?, category = ?, price = ?, old_price = ?, weight = ?, 
          description = ?, origin = ?, year = ?, image = ?, in_stock = ?, is_new = ?, is_bestseller = ?
      WHERE id = ?
    `)

    stmt.run(
      product.name,
      product.nameZh || "",
      product.category,
      product.price,
      product.oldPrice || null,
      product.weight,
      product.description,
      product.origin,
      product.year || null,
      product.image,
      product.inStock ? 1 : 0,
      product.isNew ? 1 : 0,
      product.isBestseller ? 1 : 0,
      product.id
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка обновления товара:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID товара не указан" }, { status: 400 })
    }

    const stmt = db.prepare("DELETE FROM products WHERE id = ?")
    stmt.run(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка удаления товара:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
