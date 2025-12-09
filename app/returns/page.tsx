"use client"

import { motion } from "framer-motion"
import { RotateCcw, Package, Clock, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24">
        <section className="bg-secondary/30 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h1 className="text-3xl lg:text-4xl font-semibold text-foreground">Возврат и обмен товара</h1>
            </motion.div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Ключевые условия */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-5 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-medium text-foreground">14 дней</h3>
                <p className="text-sm text-muted-foreground mt-1">на возврат товара</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-5 text-center">
                <Package className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-medium text-foreground">Товарный вид</h3>
                <p className="text-sm text-muted-foreground mt-1">сохранена упаковка</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-5 text-center">
                <RotateCcw className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-medium text-foreground">3-5 дней</h3>
                <p className="text-sm text-muted-foreground mt-1">возврат средств</p>
              </div>
            </div>

            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Условия возврата</h2>
                <p className="mb-4">
                  В соответствии с законодательством РФ о защите прав потребителей, вы можете вернуть товар надлежащего
                  качества в течение 14 дней с момента покупки.
                </p>
                <p>Для возврата необходимо:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Сохранить товарный вид и потребительские свойства товара</li>
                  <li>Сохранить оригинальную упаковку</li>
                  <li>Предъявить чек или иной документ, подтверждающий покупку</li>
                  <li>Товар не должен быть в употреблении (упаковка не вскрыта)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Возврат товара ненадлежащего качества</h2>
                <p>
                  Если вы обнаружили дефект товара, мы обменяем его на аналогичный или вернём полную стоимость. Для
                  этого свяжитесь с нами в течение 14 дней с момента получения.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Как оформить возврат</h2>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Свяжитесь с нами по телефону +7 (4832) 12-34-56 или email info@teadragon.ru</li>
                  <li>Сообщите номер заказа и причину возврата</li>
                  <li>Привезите товар в магазин или отправьте по адресу: г. Брянск, ТЦ «БУМ Сити», 2 этаж, пав. 215</li>
                  <li>Получите возврат средств в течение 3-5 рабочих дней</li>
                </ol>
              </section>

              <section className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-foreground">Важно</h3>
                    <p className="text-sm mt-1">
                      Продукты питания (чай) надлежащего качества возврату и обмену не подлежат согласно Постановлению
                      Правительства РФ №2463. Исключение — товар с дефектом или истёкшим сроком годности.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Возврат денежных средств</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>При оплате картой — возврат на карту в течение 3-5 рабочих дней</li>
                  <li>При оплате наличными — возврат наличными в магазине или на указанные реквизиты</li>
                  <li>Бонусные баллы, использованные при покупке, возвращаются на бонусный счёт</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
