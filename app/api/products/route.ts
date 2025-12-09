import { NextRequest, NextResponse } from "next/server"
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let products = await getAllProducts()

    if (category && category !== "all") {
      products = products.filter((p: any) => p.category === category)
    }

    // Filter only in stock
    products = products.filter((p: any) => p.in_stock)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Ошибка получения товаров:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = await request.json()
    const newProduct = await createProduct(product)
    return NextResponse.json({ success: true, product: newProduct })
  } catch (error) {
    console.error("Ошибка создания товара:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const product = await request.json()
    const updatedProduct = await updateProduct(product.id, product)
    return NextResponse.json({ success: true, product: updatedProduct })
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

    await deleteProduct(parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка удаления товара:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
