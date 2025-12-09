"use client"

import Link from "next/link"
import { DragonLogo } from "./dragon-logo"
import { Phone, MapPin, Clock, Mail } from "lucide-react"
import { useSiteSettings } from "@/lib/use-site-settings"

const footerLinks = {
  catalog: [
    { name: "Пуэр", href: "/catalog?category=puer" },
    { name: "Улун", href: "/catalog?category=oolong" },
    { name: "Зелёный чай", href: "/catalog?category=green" },
    { name: "Белый чай", href: "/catalog?category=white" },
    { name: "Красный чай", href: "/catalog?category=red" },
    { name: "Посуда", href: "/catalog?category=teaware" },
  ],
  info: [
    { name: "О магазине", href: "/about" },
    { name: "Доставка и оплата", href: "/delivery" },
    { name: "Бонусная программа", href: "/profile" },
    { name: "Контакты", href: "/contacts" },
  ],
  legal: [
    { name: "Политика конфиденциальности", href: "/privacy" },
    { name: "Пользовательское соглашение", href: "/terms" },
    { name: "Возврат и обмен", href: "/returns" },
    { name: "Публичная оферта", href: "/offer" },
  ],
}

export function Footer() {
  const { settings } = useSiteSettings()

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Логотип и контакты */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <DragonLogo size="lg" animated={false} />
              <div>
                <span className="text-xl font-semibold tracking-wide text-foreground">Чайный Дракон</span>
                <span className="block text-sm text-muted-foreground tracking-widest">茶龍</span>
              </div>
            </Link>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                <span>{settings.contact_address || "г. Брянск, ТЦ «БУМ Сити», 2 этаж, павильон 215"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                <a
                  href={`tel:${settings.contact_phone?.replace(/[^0-9+]/g, "") || "+74832123456"}`}
                  className="hover:text-primary transition-colors"
                >
                  {settings.contact_phone || "+7 (4832) 12-34-56"}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                <a href={`mailto:${settings.contact_email || "info@teadragon.ru"}`} className="hover:text-primary transition-colors">
                  {settings.contact_email || "info@teadragon.ru"}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                <span>{settings.contact_hours || "Пн-Вс: 10:00 — 21:00"}</span>
              </div>
            </div>
          </div>

          {/* Каталог */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 tracking-wide">Каталог</h3>
            <ul className="space-y-2">
              {footerLinks.catalog.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Информация */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 tracking-wide">Информация</h3>
            <ul className="space-y-2">
              {footerLinks.info.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Правовая информация */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 tracking-wide">Документы</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Чайный Дракон. Все права защищены.
            </p>
            <p className="text-xs text-muted-foreground/60">
              {settings.footer_company_name || "ИП Иванов И.И."} ОГРНИП {settings.footer_ogrn || "312325678901234"} ИНН{" "}
              {settings.footer_inn || "325612345678"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
