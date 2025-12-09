"use client"

import { useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Minus, Plus, ShoppingBag, ArrowLeft, Check, MapPin, Truck } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { getProductById, products } from "@/lib/products"
import { useCart } from "@/lib/cart-context"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const product = getProductById(id)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCart()

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Товар не найден</h1>
          <Link href="/catalog">
            <Button>Вернуться в каталог</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      weight: product.weight,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Навигация */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Изображение */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary/30 border border-border">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Бейджи */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded">
                      Новинка
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-sm font-medium rounded">
                      Хит продаж
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Информация */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
              <span className="text-sm tracking-[0.2em] text-muted-foreground uppercase">{product.nameZh}</span>
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mt-2">{product.name}</h1>

              <div className="flex items-center gap-4 mt-4">
                <span className="text-3xl font-semibold text-foreground">
                  {product.price.toLocaleString("ru-RU")} ₽
                </span>
                {product.oldPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.oldPrice.toLocaleString("ru-RU")} ₽
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mt-2">{product.weight}</p>

              <div className="border-t border-border my-6 pt-6">
                <p className="text-foreground leading-relaxed">{product.description}</p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Происхождение:</span>
                    <span className="text-foreground">{product.origin}</span>
                  </div>
                  {product.year && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-4 h-4 text-primary text-center">年</span>
                      <span className="text-muted-foreground">Год урожая:</span>
                      <span className="text-foreground">{product.year}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Количество и добавление в корзину */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-secondary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-secondary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button size="lg" onClick={handleAddToCart} className="flex-1" disabled={isAdded}>
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Добавлено в корзину
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5 mr-2" />В корзину —{" "}
                      {(product.price * quantity).toLocaleString("ru-RU")} ₽
                    </>
                  )}
                </Button>
              </div>

              {/* Доставка */}
              <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Доставка по Брянску</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Бесплатно при заказе от 2000 ₽. Доставка в день заказа при оформлении до 16:00.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Похожие товары */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 lg:mt-24">
              <h2 className="text-2xl font-semibold text-foreground mb-8">Похожие товары</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
