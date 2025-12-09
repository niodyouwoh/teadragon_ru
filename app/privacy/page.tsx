"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24">
        <section className="bg-secondary/30 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h1 className="text-3xl lg:text-4xl font-semibold text-foreground">Политика конфиденциальности</h1>
            </motion.div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-stone max-w-none"
          >
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Общие положения</h2>
                <p>
                  Настоящая Политика конфиденциальности персональных данных (далее — Политика) действует в отношении
                  всей информации, которую интернет-магазин «Чайный Дракон» может получить о Пользователе во время
                  использования сайта.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">2. Персональные данные</h2>
                <p>Мы собираем следующие персональные данные:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Фамилия, имя, отчество</li>
                  <li>Контактный телефон</li>
                  <li>Адрес электронной почты</li>
                  <li>Адрес доставки</li>
                  <li>История заказов</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">3. Цели сбора данных</h2>
                <p>Персональные данные используются для:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Оформления и доставки заказов</li>
                  <li>Связи с покупателем для подтверждения заказа</li>
                  <li>Начисления бонусов по программе лояльности</li>
                  <li>Информирования об акциях и новинках (с согласия)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Защита данных</h2>
                <p>
                  Мы принимаем все необходимые меры для защиты персональных данных от неправомерного доступа, изменения,
                  раскрытия или уничтожения. Доступ к персональным данным имеют только уполномоченные сотрудники.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Передача данных третьим лицам</h2>
                <p>
                  Мы не передаём персональные данные третьим лицам, за исключением случаев, когда это необходимо для
                  выполнения заказа (служба доставки) или требуется по закону.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Права пользователя</h2>
                <p>Вы имеете право:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Получить информацию о своих персональных данных</li>
                  <li>Требовать исправления неточных данных</li>
                  <li>Требовать удаления персональных данных</li>
                  <li>Отозвать согласие на обработку данных</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Контакты</h2>
                <p>
                  По вопросам обработки персональных данных обращайтесь:
                  <a href="mailto:info@teadragon.ru" className="text-primary hover:underline ml-1">
                    info@teadragon.ru
                  </a>
                </p>
              </section>

              <p className="text-sm mt-8">Последнее обновление: декабрь 2024 года</p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
