import { useState, useEffect } from "react"

export interface SiteSettings {
  hero_subtitle?: string
  hero_title?: string
  hero_description?: string
  hero_image?: string
  feature1_title?: string
  feature1_description?: string
  feature2_title?: string
  feature2_description?: string
  feature3_title?: string
  feature3_description?: string
  feature4_title?: string
  feature4_description?: string
  cta_title?: string
  cta_description?: string
  contact_phone?: string
  contact_email?: string
  contact_address?: string
  contact_hours?: string
  footer_company_name?: string
  footer_inn?: string
  footer_ogrn?: string
}

const defaultSettings: SiteSettings = {
  hero_subtitle: "茶道 — Путь чая",
  hero_title: "Откройте мир китайского чая",
  hero_description:
    "Коллекция редких сортов чая прямиком из провинций Юньнань, Фуцзянь и Тайваня. Традиции, проверенные веками.",
  hero_image: "/placeholder.svg?height=600&width=600",
  feature1_title: "Прямые поставки",
  feature1_description: "Работаем напрямую с фермерами Китая и Тайваня",
  feature2_title: "Гарантия качества",
  feature2_description: "Только свежий урожай и правильное хранение",
  feature3_title: "Быстрая доставка",
  feature3_description: "Доставка по Брянску в день заказа",
  feature4_title: "Бонусы",
  feature4_description: "5% от каждой покупки на бонусный счёт",
  cta_title: "Посетите наш магазин в Брянске",
  cta_description:
    "Приходите на дегустацию в наш уютный чайный уголок. Опытные консультанты помогут подобрать чай по вашим предпочтениям.",
  contact_phone: "+7 (4832) 12-34-56",
  contact_email: "info@teadragon.ru",
  contact_address: "г. Брянск, ТЦ «БУМ Сити», 2 этаж, павильон 215",
  contact_hours: "Пн-Вс: 10:00 — 21:00",
  footer_company_name: "ИП Иванов И.И.",
  footer_inn: "325612345678",
  footer_ogrn: "312325678901234",
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      const data = await response.json()
      if (data.settings) {
        setSettings({ ...defaultSettings, ...data.settings })
      }
    } catch (error) {
      console.error("Ошибка загрузки настроек:", error)
    } finally {
      setLoading(false)
    }
  }

  return { settings, loading, reload: loadSettings }
}
