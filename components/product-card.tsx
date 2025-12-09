"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingBag, Plus, Check } from "lucide-react"
import type { Product } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      weight: product.weight,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/product/${product.id}`} className="group block">
        <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
          {/* Изображение */}
          <div className="relative aspect-square overflow-hidden bg-secondary/30">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Бейджи */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
                  Новинка
                </span>
              )}
              {product.isBestseller && (
                <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded">Хит</span>
              )}
              {product.oldPrice && (
                <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded">
                  Скидка
                </span>
              )}
            </div>

            {/* Кнопка добавления */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-foreground/5 flex items-center justify-center"
            >
              <Button
                onClick={handleAddToCart}
                size="lg"
                className={cn("transition-all", isAdded && "bg-green-600 hover:bg-green-600")}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Добавлено
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />В корзину
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Информация */}
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1 tracking-wider">{product.nameZh}</p>
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{product.weight}</p>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-foreground">{product.price.toLocaleString("ru-RU")} ₽</span>
                {product.oldPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.oldPrice.toLocaleString("ru-RU")} ₽
                  </span>
                )}
              </div>

              <Button variant="ghost" size="icon" onClick={handleAddToCart} className="lg:hidden">
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
