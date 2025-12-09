"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Package, ShoppingCart, Users } from "lucide-react"
import { DragonLogo } from "@/components/dragon-logo"
import ProductsManager from "@/components/admin/products-manager"
import OrdersManager from "@/components/admin/orders-manager"
import UsersManager from "@/components/admin/users-manager"
import ContentEditor from "@/components/admin/content-editor"
import CategoriesManager from "@/components/admin/categories-manager"

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const adminData = localStorage.getItem("admin")
    if (!adminData) {
      router.push("/admin")
      return
    }
    setAdmin(JSON.parse(adminData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin")
    router.push("/admin")
  }

  if (!admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DragonLogo size="md" animated={false} />
              <div>
                <h1 className="text-xl font-semibold">Админ-панель</h1>
                <p className="text-sm text-muted-foreground">Чайный Дракон</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Привет, {admin.username}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="products">
              <Package className="w-4 h-4 mr-2" />
              Товары
            </TabsTrigger>
            <TabsTrigger value="categories">
              <span className="w-4 h-4 mr-2">🏷️</span>
              Категории
            </TabsTrigger>
            <TabsTrigger value="content">
              <span className="w-4 h-4 mr-2">✏️</span>
              Live-контент
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Пользователи
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesManager />
          </TabsContent>

          <TabsContent value="content">
            <ContentEditor />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManager />
          </TabsContent>

          <TabsContent value="users">
            <UsersManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
