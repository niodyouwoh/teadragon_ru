"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function OrdersManager() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      const data = await response.json()
      setOrders(data.orders)
    } catch (error) {
      console.error("Ошибка загрузки заказов:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: "secondary",
      processing: "default",
      shipped: "default",
      delivered: "default",
    }
    const labels: any = {
      pending: "Ожидает оплаты",
      processing: "В обработке",
      shipped: "Отправлен",
      delivered: "Доставлен",
    }
    return <Badge variant={variants[status] || "secondary"}>{labels[status] || status}</Badge>
  }

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Заказы</h2>

      <div className="grid gap-4">
        {orders.map((order: any) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">Заказ #{order.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.username} • {new Date(order.created_at).toLocaleDateString("ru-RU")}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Сумма:</span> {order.total} ₽
                </div>
                <div>
                  <span className="text-muted-foreground">Бонусов использовано:</span> {order.bonus_used}
                </div>
                <div>
                  <span className="text-muted-foreground">Бонусов начислено:</span> {order.bonus_earned}
                </div>
                <div>
                  <span className="text-muted-foreground">Скидка:</span> {order.discount_percent}%
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Телефон:</span> {order.customer_phone}
                </div>
                {order.delivery_address && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Адрес:</span> {order.delivery_address}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
