"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Leaf, Mountain, Users, Award } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DragonLogo } from "@/components/dragon-logo"
import { Button } from "@/components/ui/button"

const values = [
  {
    icon: Leaf,
    title: "Качество",
    description: "Тщательно отбираем каждый сорт чая, работая напрямую с проверенными фермерами Китая и Тайваня.",
  },
  {
    icon: Mountain,
    title: "Традиции",
    description: "Сохраняем и передаём многовековые традиции китайской чайной культуры, которым более 5000 лет.",
  },
  {
    icon: Users,
    title: "Забота",
    description: "Помогаем каждому гостю найти свой чай, учитывая индивидуальные предпочтения и настроение.",
  },
  {
    icon: Award,
    title: "Экспертиза",
    description: "Наши консультанты — сертифицированные чайные мастера с опытом работы более 10 лет.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24">
        {/* Заголовок */}
        <section className="bg-secondary/30 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <span className="text-sm tracking-[0.2em] text-muted-foreground uppercase">关于我们</span>
              <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mt-2">О магазине</h1>
            </motion.div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* История */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <DragonLogo size="xl" className="mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Чайный Дракон — ваш проводник в мир китайского чая
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Наш магазин был основан в 2018 году любителями настоящего китайского чая. Мы начинали с небольшой
                    коллекции редких пуэров, а сегодня предлагаем более 50 сортов чая из лучших чайных регионов Китая и
                    Тайваня.
                  </p>
                  <p>
                    «Чайный Дракон» — это не просто магазин, а место, где можно погрузиться в атмосферу настоящей
                    китайской чайной культуры. Мы проводим дегустации, чайные церемонии и мастер-классы для всех
                    желающих.
                  </p>
                  <p>
                    Каждый чай в нашей коллекции прошёл строгий отбор. Мы лично посещаем чайные плантации, знаем
                    фермеров по именам и можем рассказать историю каждого сорта.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=480"
                  alt="Интерьер чайного магазина"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.section>

          {/* Наши ценности */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">Наши ценности</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-card border border-border rounded-lg p-6"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center p-8 bg-primary text-primary-foreground rounded-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Приходите к нам</h2>
            <p className="opacity-90 mb-6 max-w-lg mx-auto">
              Мы находимся в ТЦ «БУМ Сити» в центре Брянска. Приходите на бесплатную дегустацию и найдите свой идеальный
              чай.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacts">
                <Button variant="secondary" size="lg">
                  Как нас найти
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/catalog">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  Смотреть каталог
                </Button>
              </Link>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
