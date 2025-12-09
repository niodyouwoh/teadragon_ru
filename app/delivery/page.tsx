"use client"

import { motion } from "framer-motion"
import { Truck, Clock, MapPin, CreditCard, Package, Check } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const deliveryMethods = [
  {
    icon: Truck,
    title: "Курьерская доставка по Брянску",
    description: "Доставка в день заказа при оформлении до 16:00",
    details: [
      "Стоимость: 200 ₽",
      "Бесплатно при заказе от 2000 ₽",
      "Время доставки: с 10:00 до 21:00",
      "Возможна доставка в указанный интервал",
    ],
  },
  {
    icon: MapPin,
    title: "Самовывоз из магазина",
    description: "Бесплатно. Заказ будет готов через 30 минут после подтверждения",
    details: [
      "Адрес: г. Брянск, ТЦ «БУМ Сити», 2 этаж, павильон 215",
      "Часы работы: 10:00 — 21:00 без выходных",
      "Хранение заказа: 3 дня",
      "Возможна дегустация при получении",
    ],
  },
  {
    icon: Package,
    title: "Доставка по области",
    description: "Доставляем в города Брянской области",
    details: [
      "Стоимость: от 300 ₽",
      "Бесплатно при заказе от 5000 ₽",
      "Срок доставки: 1-2 дня",
      "Клинцы, Новозыбков, Унеча, Стародуб и др.",
    ],
  },
]

const paymentMethods = [
  {
    title: "Банковской картой онлайн",
    description: "Visa, MasterCard, МИР",
  },
  {
    title: "Наличными при получении",
    description: "Курьеру или в магазине",
  },
  {
    title: "СБП (Система быстрых платежей)",
    description: "По QR-коду или номеру телефона",
  },
  {
    title: "Переводом на карту",
    description: "Сбербанк, Тинькофф",
  },
]

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24">
        {/* Заголовок */}
        <section className="bg-secondary/30 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <span className="text-sm tracking-[0.2em] text-muted-foreground uppercase">配送信息</span>
              <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mt-2">Доставка и оплата</h1>
            </motion.div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Способы доставки */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-8 flex items-center gap-3">
              <Truck className="w-6 h-6 text-primary" />
              Способы доставки
            </h2>

            <div className="space-y-6">
              {deliveryMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-lg p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <method.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{method.title}</h3>
                      <p className="text-muted-foreground mt-1">{method.description}</p>
                      <ul className="mt-4 space-y-2">
                        {method.details.map((detail) => (
                          <li key={detail} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Способы оплаты */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-2xl font-semibold text-foreground mb-8 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-primary" />
              Способы оплаты
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {paymentMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-card border border-border rounded-lg p-5"
                >
                  <h3 className="font-medium text-foreground">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Важная информация */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 p-6 bg-primary/5 border border-primary/20 rounded-lg"
          >
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Важная информация
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Минимальная сумма заказа для доставки: 500 ₽</li>
              <li>• После оформления заказа с вами свяжется оператор для подтверждения</li>
              <li>• При получении проверяйте целостность упаковки</li>
              <li>• Возврат товара возможен в течение 14 дней при сохранении товарного вида</li>
            </ul>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
