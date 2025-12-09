"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DragonLogo } from "@/components/dragon-logo"

const contacts = [
  {
    icon: MapPin,
    title: "Адрес",
    content: "г. Брянск, ТЦ «БУМ Сити»",
    details: "2 этаж, павильон 215",
  },
  {
    icon: Phone,
    title: "Телефон",
    content: "+7 (4832) 12-34-56",
    details: "Звоните в часы работы",
    href: "tel:+74832123456",
  },
  {
    icon: Mail,
    title: "Email",
    content: "info@teadragon.ru",
    details: "Ответим в течение 24 часов",
    href: "mailto:info@teadragon.ru",
  },
  {
    icon: Clock,
    title: "Часы работы",
    content: "10:00 — 21:00",
    details: "Ежедневно без выходных",
  },
]

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 lg:pt-24">
        {/* Заголовок */}
        <section className="bg-secondary/30 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <span className="text-sm tracking-[0.2em] text-muted-foreground uppercase">联系我们</span>
              <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mt-2">Контакты</h1>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Приходите на дегустацию в наш уютный чайный уголок или свяжитесь с нами любым удобным способом
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Контактная информация */}
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {contact.href ? (
                  <a
                    href={contact.href}
                    className="block bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                  >
                    <ContactContent contact={contact} />
                  </a>
                ) : (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <ContactContent contact={contact} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Карта */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            <div className="aspect-[16/9] relative bg-secondary/30">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2405.123456789!2d34.4167!3d53.2521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTPCsDE1JzA3LjYiTiAzNMKwMjUnMDAuMSJF!5e0!3m2!1sru!2sru!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-2">Как нас найти</h3>
              <p className="text-sm text-muted-foreground">
                ТЦ «БУМ Сити» расположен в центре города. Вход со стороны проспекта Ленина. Поднимитесь на 2 этаж — мы
                находимся напротив эскалатора, павильон 215. Рядом бесплатная парковка.
              </p>
            </div>
          </motion.div>

          {/* Мессенджеры */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Мы в мессенджерах
            </h3>
            <div className="flex justify-center gap-4">
              <a
                href="https://t.me/teadragon"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#0088cc] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Telegram
              </a>
              <a
                href="https://wa.me/74832123456"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#25D366] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Приглашение */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center p-8 bg-primary/5 border border-primary/20 rounded-lg"
          >
            <DragonLogo size="lg" animated={false} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Приглашаем на дегустацию</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Приходите попробовать редкие сорта чая в уютной атмосфере. Наши консультанты расскажут о традициях
              чаепития и помогут выбрать чай по вашим предпочтениям.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function ContactContent({ contact }: { contact: (typeof contacts)[0] }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <contact.icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">{contact.title}</span>
      </div>
      <p className="text-lg font-medium text-foreground">{contact.content}</p>
      <p className="text-sm text-muted-foreground mt-1">{contact.details}</p>
    </>
  )
}
