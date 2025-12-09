"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Leaf, Award, Truck, Gift } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DragonLogo } from "@/components/dragon-logo"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/products"
import { useSiteSettings } from "@/lib/use-site-settings"

export default function HomePage() {
  const [bestsellers, setBestsellers] = useState<any[]>([])
  const [newProducts, setNewProducts] = useState<any[]>([])
  const { settings, loading } = useSiteSettings()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      
      if (data.products) {
        const products = data.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          nameZh: p.name_zh,
          category: p.category,
          price: p.price,
          oldPrice: p.old_price,
          weight: p.weight,
          description: p.description,
          origin: p.origin,
          year: p.year,
          image: p.image,
          inStock: p.in_stock === 1,
          isNew: p.is_new === 1,
          isBestseller: p.is_bestseller === 1,
        }))

        setBestsellers(products.filter((p: any) => p.isBestseller))
        setNewProducts(products.filter((p: any) => p.isNew))
      }
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error)
    }
  }

  const features = [
    {
      icon: Leaf,
      title: settings.feature1_title || "Прямые поставки",
      description: settings.feature1_description || "Работаем напрямую с фермерами Китая и Тайваня",
    },
    {
      icon: Award,
      title: settings.feature2_title || "Гарантия качества",
      description: settings.feature2_description || "Только свежий урожай и правильное хранение",
    },
    {
      icon: Truck,
      title: settings.feature3_title || "Быстрая доставка",
      description: settings.feature3_description || "Доставка по Брянску в день заказа",
    },
    {
      icon: Gift,
      title: settings.feature4_title || "Бонусы",
      description: settings.feature4_description || "5% от каждой покупки на бонусный счёт",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
          {/* Фоновый паттерн */}
          <div className="absolute inset-0 chinese-pattern opacity-30" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Текст */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <span className="text-sm tracking-[0.3em] text-muted-foreground uppercase mb-4 block">
                  {settings.hero_subtitle || "茶道 — Путь чая"}
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight text-balance">
                  {settings.hero_title || "Откройте мир китайского чая"}
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  {settings.hero_description ||
                    "Коллекция редких сортов чая прямиком из провинций Юньнань, Фуцзянь и Тайваня. Традиции, проверенные веками."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                  <Button size="lg" className="w-full sm:w-auto px-8" asChild>
                    <Link href="/catalog">
                      Перейти в каталог
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 bg-transparent" asChild>
                    <Link href="/about">
                      О магазине
                    </Link>
                  </Button>
                </div>
              </motion.div>

              {/* Изображение */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-primary/5 rounded-full" />
                  <Image
                    src={settings.hero_image || "/placeholder.svg?height=600&width=600"}
                    alt="Китайская чайная церемония"
                    fill
                    className="object-cover rounded-2xl"
                    priority
                  />

                  {/* Декоративный элемент */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute -top-8 -right-8 opacity-20 z-10"
                  >
                    <DragonLogo size="xl" animated={false} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Преимущества */}
        <section className="py-16 lg:py-24 bg-secondary/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Категории */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-sm tracking-[0.2em] text-muted-foreground uppercase">Категории</span>
              <h2 className="text-3xl lg:text-4xl font-semibold text-foreground mt-2">Наша коллекция</h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories
                .filter((c) => c.id !== "all")
                .map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link href={`/catalog?category=${category.id}`} className="block group">
                      <div className="aspect-square relative rounded-lg overflow-hidden bg-secondary/50 border border-border hover:border-primary/50 transition-colors">
                        <Image
                          src={
                            settings[`category_${category.id}_image` as keyof typeof settings] ||
                            `/placeholder.svg?height=200&width=200&query=${category.name}`
                          }
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/30 transition-colors" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                          <span className="text-xs text-white/80 mb-1">{category.nameZh}</span>
                          <span className="text-white font-medium">{category.name}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>

        {/* Хиты продаж */}
        <section className="py-16 lg:py-24 bg-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <span className="text-sm tracking-[0.2em] text-muted-foreground uppercase">Популярное</span>
                <h2 className="text-3xl lg:text-4xl font-semibold text-foreground mt-2">Хиты продаж</h2>
              </div>
              <Button variant="outline" asChild>
                <Link href="/catalog">
                  Все товары
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.slice(0, 4).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Новинки */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <span className="text-sm tracking-[0.2em] text-muted-foreground uppercase">Свежие поступления</span>
                <h2 className="text-3xl lg:text-4xl font-semibold text-foreground mt-2">Новинки</h2>
              </div>
              <Button variant="outline" asChild>
                <Link href="/catalog">
                  Смотреть все
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA блок */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <DragonLogo size="lg" animated={false} className="mx-auto mb-6 text-primary-foreground" />
              <h2 className="text-3xl lg:text-4xl font-semibold mb-4 text-balance">
                {settings.cta_title || "Посетите наш магазин в Брянске"}
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                {settings.cta_description ||
                  "Приходите на дегустацию в наш уютный чайный уголок. Опытные консультанты помогут подобрать чай по вашим предпочтениям."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
                  <Link href="/contacts">
                    Как нас найти
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                  asChild
                >
                  <a href={`tel:${settings.contact_phone?.replace(/[^0-9+]/g, "") || "+74832123456"}`}>
                    {settings.contact_phone || "+7 (4832) 12-34-56"}
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
