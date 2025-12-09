"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Copy, Phone } from "lucide-react"

function OrderSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)

  const orderId = searchParams.get("orderId")
  const total = searchParams.get("total")
  const phone = searchParams.get("phone") || "+79307221110"

  const copyPhone = () => {
    navigator.clipboard.writeText(phone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-semibold mb-2">Заказ оформлен!</h1>
          <p className="text-muted-foreground">Номер заказа: #{orderId}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Оплата по СБП
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Переведите <span className="font-semibold text-foreground">{total} ₽</span> по номеру телефона:
            </p>

            <div className="flex items-center gap-2 p-4 bg-primary/10 rounded-lg">
              <span className="text-2xl font-semibold flex-1">{phone}</span>
              <Button variant="outline" size="sm" onClick={copyPhone}>
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Скопировано!" : "Копировать"}
              </Button>
            </div>

            <div className="bg-secondary/50 p-4 rounded-lg space-y-2 text-sm">
              <p className="font-medium">Инструкция:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Откройте приложение вашего банка</li>
                <li>Выберите "Перевод по номеру телефона" или "СБП"</li>
                <li>Введите номер: {phone}</li>
                <li>Укажите сумму: {total} ₽</li>
                <li>В комментарии укажите номер заказа: #{orderId}</li>
                <li>Подтвердите перевод</li>
              </ol>
            </div>

            <p className="text-sm text-muted-foreground">
              После получения оплаты мы свяжемся с вами для подтверждения заказа. Обычно это занимает 5-15 минут.
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => router.push("/profile")}>
            Мои заказы
          </Button>
          <Button onClick={() => router.push("/catalog")}>Продолжить покупки</Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
