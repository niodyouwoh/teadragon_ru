"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24">
        <section className="bg-secondary/30 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h1 className="text-3xl lg:text-4xl font-semibold text-foreground">Пользовательское соглашение</h1>
            </motion.div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 text-muted-foreground"
          >
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Общие положения</h2>
              <p>
                Настоящее Пользовательское соглашение регулирует отношения между администрацией интернет-магазина
                «Чайный Дракон» и пользователями сайта. Использование сайта означает согласие с условиями настоящего
                соглашения.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">2. Предмет соглашения</h2>
              <p>
                Администрация сайта предоставляет пользователю право использовать сайт для ознакомления с ассортиментом
                товаров, оформления заказов, участия в бонусной программе и получения информации о магазине.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">3. Права и обязанности сторон</h2>
              <h3 className="font-medium text-foreground mt-4 mb-2">Пользователь вправе:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Просматривать информацию о товарах</li>
                <li>Оформлять заказы</li>
                <li>Регистрироваться на сайте</li>
                <li>Участвовать в бонусной программе</li>
              </ul>

              <h3 className="font-medium text-foreground mt-4 mb-2">Пользователь обязан:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Предоставлять достоверную информацию при оформлении заказа</li>
                <li>Не использовать сайт в противоправных целях</li>
                <li>Соблюдать условия настоящего соглашения</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">4. Ответственность</h2>
              <p>
                Администрация не несёт ответственности за временную недоступность сайта, вызванную техническими
                причинами. Мы стремимся обеспечить актуальность информации о товарах, но рекомендуем уточнять детали при
                оформлении заказа.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">5. Изменение условий</h2>
              <p>
                Администрация оставляет за собой право вносить изменения в настоящее соглашение без предварительного
                уведомления. Актуальная версия всегда доступна на сайте.
              </p>
            </section>

            <p className="text-sm mt-8">Последнее обновление: декабрь 2024 года</p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
