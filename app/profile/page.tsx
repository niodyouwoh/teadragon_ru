"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Gift, Package, LogOut, Phone, Award, TrendingUp } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getLevelName, getDiscount, getNextLevelInfo } from "@/lib/levels"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"info" | "orders" | "bonuses">("info")
  const [isRegistering, setIsRegistering] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    phone: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      loadOrders(JSON.parse(userData).id)
    }
  }, [])

  const loadOrders = async (userId: number) => {
    try {
      const response = await fetch(`/api/orders?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setUser((prev: any) => ({ ...prev, orders: data.orders }))
      }
    } catch (error) {
      console.error("Ошибка загрузки заказов:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Ошибка")
        setLoading(false)
        return
      }

      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)
      loadOrders(data.user.id)
    } catch (error) {
      setError("Ошибка подключения к серверу")
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      pending: "Ожидает оплаты",
      processing: "В обработке",
      shipped: "В доставке",
      delivered: "Доставлен",
    }
    return statuses[status] || status
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 lg:pt-24">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-semibold">{isRegistering ? "Регистрация" : "Вход в аккаунт"}</h1>
                <p className="text-muted-foreground mt-2">
                  {isRegistering
                    ? "Создайте аккаунт и получите 100 приветственных бонусов"
                    : "Войдите, чтобы отслеживать заказы и копить бонусы"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="username">Логин</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                {isRegistering && (
                  <>
                    <div>
                      <Label htmlFor="name">Имя (необязательно)</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон (необязательно)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Загрузка..." : isRegistering ? "Зарегистрироваться" : "Войти"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsRegistering(!isRegistering)
                    setError("")
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  {isRegistering ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
                </button>
              </div>

              {isRegistering && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Приветственный бонус</p>
                      <p className="text-xs text-muted-foreground">100 бонусов при регистрации</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const nextLevelInfo = getNextLevelInfo(user.level, user.totalSpent)
  const discountPercent = getDiscount(user.level)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Заголовок профиля */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">{user.name || user.username}</h1>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                  </Button>
                </div>

                {/* Уровень и прогресс */}
                <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{getLevelName(user.level)}</span>
                      {discountPercent > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          -{discountPercent}%
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-primary">{user.bonusPoints}</p>
                      <p className="text-xs text-muted-foreground">бонусов</p>
                    </div>
                  </div>

                  {nextLevelInfo.nextLevel && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          До уровня "{getLevelName(nextLevelInfo.nextLevel)}"
                        </span>
                        <span className="font-medium">{nextLevelInfo.remaining} ₽</span>
                      </div>
                      <Progress value={nextLevelInfo.progress} className="h-2" />
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Потрачено: {user.totalSpent} ₽</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Табы */}
            <div className="flex gap-2 mb-6 border-b border-border">
              {[
                { id: "info", label: "Данные", icon: User },
                { id: "orders", label: "Заказы", icon: Package },
                { id: "bonuses", label: "Бонусы", icon: Gift },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Контент табов */}
            {activeTab === "info" && (
              <Card>
                <CardHeader>
                  <CardTitle>Личные данные</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Логин</p>
                      <p>{user.username}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Телефон</p>
                        <p>{user.phone}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "orders" && (
              <div className="space-y-4">
                {user.orders && user.orders.length > 0 ? (
                  user.orders.map((order: any) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-medium">Заказ #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString("ru-RU", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <Badge>{getStatusText(order.status)}</Badge>
                        </div>
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Сумма:</span>
                            <span>{order.total} ₽</span>
                          </div>
                          {order.discount_percent > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Скидка ({order.discount_percent}%):</span>
                              <span>применена</span>
                            </div>
                          )}
                          {order.bonus_used > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Бонусов использовано:</span>
                              <span>{order.bonus_used}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-primary pt-4 border-t">
                          <Gift className="w-4 h-4" />
                          +{order.bonus_earned} бонусов начислено
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-12 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>У вас пока нет заказов</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "bonuses" && (
              <Card>
                <CardHeader>
                  <CardTitle>Бонусная программа</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Уровни и скидки</h3>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• Новичок (0 ₽) — 0% скидка</li>
                          <li>• Подмастерье (20 000 ₽) — 10% скидка</li>
                          <li>• Сенсей (50 000 ₽) — 15% скидка</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-lg">
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Gift className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium">Накопление и использование</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          5% от суммы каждого заказа возвращается бонусами. Оплачивайте бонусами до 30% стоимости
                          заказа.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
