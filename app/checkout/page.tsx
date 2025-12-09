"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/lib/cart-context"
import { getDiscount, getLevelName } from "@/lib/levels"
import { ShoppingBag, CreditCard, Truck, Gift } from "lucide-react"
import Image from "next/image"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [bonusUsed, setBonusUsed] = useState(0)

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    deliveryMethod: "pickup",
    deliveryAddress: "",
    notes: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/profile")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setFormData((prev) => ({
      ...prev,
      customerName: parsedUser.name || "",
      customerPhone: parsedUser.phone || "",
    }))
  }, [router])

  if (!user || items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Корзина пуста</h1>
          <p className="text-muted-foreground mb-6">Добавьте товары в корзину для оформления заказа</p>
          <Button onClick={() => router.push("/catalog")}>Перейти в каталог</Button>
        </main>
        <Footer />
      </div>
    )
  }

  const discountPercent = getDiscount(user.level)
  const discountAmount = (total * discountPercent) / 100
  const maxBonusUsage = Math.min(user.bonusPoints, Math.floor(total * 0.3)) // Максимум 30% от суммы
  const finalTotal = total - discountAmount - bonusUsed
  const bonusEarned = Math.floor((total - discountAmount) * 0.05)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          bonusUsed,
          ...formData,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        clearCart()
        router.push(`/order-success?orderId=${data.orderId}&total=${data.total}&phone=${data.paymentPhone}`)
      } else {
        alert(data.error || "Ошибка создания заказа")
        setLoading(false)
      }
    } catch (error) {
      console.error("Ошибка:", error)
      alert("Ошибка подключения к серверу")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-3xl font-semibold mb-8">Оформление заказа</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Ваш заказ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <Image src={item.image} alt={item.name} width={60} height={60} className="rounded object-cover" />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.price} ₽ × {item.quantity}
                      </p>
                    </div>
                    <div className="font-semibold">{item.price * item.quantity} ₽</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Доставка
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Имя</Label>
                    <Input
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Телефон</Label>
                    <Input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Способ получения</Label>
                    <RadioGroup
                      value={formData.deliveryMethod}
                      onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup">Самовывоз из магазина (бесплатно)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery">Доставка по Брянску (200 ₽)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.deliveryMethod === "delivery" && (
                    <div className="space-y-2">
                      <Label>Адрес доставки</Label>
                      <Input
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                        placeholder="Улица, дом, квартира"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Комментарий к заказу (необязательно)</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Оформление..." : "Оформить заказ"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Бонусы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ваш уровень:</span>
                  <span className="font-semibold">{getLevelName(user.level)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Доступно бонусов:</span>
                  <span className="font-semibold">{user.bonusPoints}</span>
                </div>
                <div className="space-y-2">
                  <Label>Использовать бонусы (макс. {maxBonusUsage})</Label>
                  <Input
                    type="number"
                    min="0"
                    max={maxBonusUsage}
                    value={bonusUsed}
                    onChange={(e) => setBonusUsed(Math.min(Number(e.target.value), maxBonusUsage))}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  За этот заказ вы получите {bonusEarned} бонусов (5% от суммы)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Итого
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Товары:</span>
                  <span>{total} ₽</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Скидка ({discountPercent}%):</span>
                    <span>-{discountAmount} ₽</span>
                  </div>
                )}
                {bonusUsed > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Бонусы:</span>
                    <span>-{bonusUsed} ₽</span>
                  </div>
                )}
                {formData.deliveryMethod === "delivery" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Доставка:</span>
                    <span>200 ₽</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                  <span>К оплате:</span>
                  <span>{finalTotal + (formData.deliveryMethod === "delivery" ? 200 : 0)} ₽</span>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg text-sm">
                  <p className="font-medium mb-1">Оплата по СБП</p>
                  <p className="text-muted-foreground">После оформления вы получите номер для перевода</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
