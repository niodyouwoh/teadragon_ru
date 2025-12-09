"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { SlidersHorizontal } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { categories, getProductsByCategory, type Product } from "@/lib/products"
import { cn } from "@/lib/utils"

function CatalogContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"

  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default")
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [activeCategory, sortBy])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products?category=${activeCategory}`)
      const data = await response.json()
      
      let result = data.products || []

      // Преобразуем из формата БД в формат Product
      result = result.map((p: any) => ({
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

      if (sortBy === "price-asc") {
        result = [...result].sort((a: Product, b: Product) => a.price - b.price)
      } else if (sortBy === "price-desc") {
        result = [...result].sort((a: Product, b: Product) => b.price - a.price)
      }

      setFilteredProducts(result)
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24">
        {/* Заголовок */}
        <section className="bg-secondary/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <span className="text-sm tracking-[0.2em] text-muted-foreground uppercase">茶叶目录</span>
              <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mt-2">Каталог чая и посуды</h1>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Более 50 сортов китайского чая и традиционная посуда для чайной церемонии
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Боковая панель фильтров - десктоп */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-4 tracking-wide">Категории</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          activeCategory === category.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        )}
                      >
                        <span className="flex items-center justify-between">
                          {category.name}
                          <span className="text-xs opacity-70">{category.nameZh}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-sm font-semibold text-foreground mb-4 tracking-wide">Сортировка</h3>
                  <div className="space-y-1">
                    {[
                      { value: "default", label: "По умолчанию" },
                      { value: "price-asc", label: "Сначала дешевле" },
                      { value: "price-desc", label: "Сначала дороже" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as typeof sortBy)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          sortBy === option.value
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/50",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Мобильные фильтры */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground">{filteredProducts.length} товаров</span>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Фильтры
                </Button>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-3">Категории</h3>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => setActiveCategory(category.id)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs transition-colors",
                                activeCategory === category.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-secondary-foreground",
                              )}
                            >
                              {category.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <h3 className="text-sm font-medium mb-3">Сортировка</h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: "default", label: "По умолчанию" },
                            { value: "price-asc", label: "Дешевле" },
                            { value: "price-desc", label: "Дороже" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setSortBy(option.value as typeof sortBy)}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs transition-colors",
                                sortBy === option.value
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-secondary-foreground",
                              )}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Сетка товаров */}
            <div className="flex-1">
              <div className="hidden lg:flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground">Найдено: {filteredProducts.length} товаров</span>
                <span className="text-sm text-muted-foreground">
                  {categories.find((c) => c.id === activeCategory)?.nameZh}
                </span>
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">Загрузка товаров...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence mode="wait">
                      {filteredProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                      ))}
                    </AnimatePresence>
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-muted-foreground">В этой категории пока нет товаров</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CatalogContent />
    </Suspense>
  )
}
