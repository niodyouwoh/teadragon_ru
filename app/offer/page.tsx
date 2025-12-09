"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function OfferPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24">
        <section className="bg-secondary/30 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h1 className="text-3xl lg:text-4xl font-semibold text-foreground">Публичная оферта</h1>
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
                Настоящий документ является официальным предложением (публичной офертой) ИП Иванов Иван Иванович, ОГРНИП
                312325678901234, ИНН 325612345678 (далее — Продавец) и содержит все существенные условия договора
                розничной купли-продажи товаров дистанционным способом.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">2. Термины и определения</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Продавец</strong> — ИП Иванов И.И., реализующий товары через интернет-магазин «Чайный Дракон»
                </li>
                <li>
                  <strong>Покупатель</strong> — физическое лицо, принявшее оферту путём оформления заказа
                </li>
                <li>
                  <strong>Товар</strong> — чай, чайная посуда и аксессуары, представленные на сайте
                </li>
                <li>
                  <strong>Заказ</strong> — оформленная Покупателем заявка на приобретение Товара
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">3. Предмет оферты</h2>
              <p>
                Продавец обязуется передать в собственность Покупателя, а Покупатель обязуется принять и оплатить Товар
                в соответствии с условиями настоящей оферты.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">4. Момент заключения договора</h2>
              <p>
                Договор считается заключённым с момента получения Продавцом акцепта оферты — подтверждения заказа
                Покупателем через сайт или по телефону.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">5. Цена товара и оплата</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Цена Товара указана на сайте в рублях и включает НДС (при применимости)</li>
                <li>Продавец вправе изменять цены на Товар без уведомления Покупателя</li>
                <li>Цена на оформленный Заказ изменению не подлежит</li>
                <li>Оплата производится способами, указанными на сайте</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">6. Доставка</h2>
              <p>
                Условия и стоимость доставки указаны на странице «Доставка и оплата». Срок доставки зависит от
                выбранного способа и адреса Покупателя.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">7. Качество товара</h2>
              <p>
                Продавец гарантирует качество Товара в соответствии с сертификатами соответствия и
                санитарно-эпидемиологическими заключениями. Срок годности указан на упаковке.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">8. Возврат и обмен</h2>
              <p>
                Условия возврата и обмена Товара регулируются законодательством РФ о защите прав потребителей и описаны
                на странице «Возврат и обмен».
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">9. Реквизиты продавца</h2>
              <div className="bg-card border border-border rounded-lg p-4">
                <p>ИП Иванов Иван Иванович</p>
                <p>ОГРНИП: 312325678901234</p>
                <p>ИНН: 325612345678</p>
                <p>Адрес: 241050, г. Брянск, ТЦ «БУМ Сити», 2 этаж, пав. 215</p>
                <p>Телефон: +7 (4832) 12-34-56</p>
                <p>Email: info@teadragon.ru</p>
              </div>
            </section>

            <p className="text-sm mt-8">Последнее обновление: декабрь 2024 года</p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
