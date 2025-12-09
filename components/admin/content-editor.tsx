"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Upload, RefreshCw } from "lucide-react"

interface SiteSettings {
  // Hero секция
  hero_subtitle: string
  hero_title: string
  hero_description: string
  hero_image: string

  // Преимущества
  feature1_title: string
  feature1_description: string
  feature2_title: string
  feature2_description: string
  feature3_title: string
  feature3_description: string
  feature4_title: string
  feature4_description: string

  // CTA блок
  cta_title: string
  cta_description: string

  // Контакты
  contact_phone: string
  contact_email: string
  contact_address: string
  contact_hours: string

  // Футер
  footer_company_name: string
  footer_inn: string
  footer_ogrn: string
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

export default function ContentEditor() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

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

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert("Настройки успешно сохранены! Обновите главную страницу чтобы увидеть изменения.")
      } else {
        alert("Ошибка сохранения настроек")
      }
    } catch (error) {
      console.error("Ошибка:", error)
      alert("Ошибка подключения к серверу")
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof SiteSettings) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      console.log("📤 Загрузка изображения:", file.name)

      // Пробуем сначала S3
      let response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      let data = await response.json()

      // Если S3 не сработал, пробуем локальную загрузку
      if (!response.ok || !data.imageUrl) {
        console.log("⚠️ S3 не сработал, пробуем локальную загрузку...")
        response = await fetch("/api/upload-local", {
          method: "POST",
          body: formData,
        })
        data = await response.json()
      }

      if (data.imageUrl) {
        console.log("✅ Изображение загружено:", data.imageUrl)
        setSettings({ ...settings, [field]: data.imageUrl })
        alert("Изображение успешно загружено!")
      } else {
        alert(`Ошибка: ${data.error || "Не удалось загрузить изображение"}`)
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки изображения:", error)
      alert("Ошибка загрузки изображения")
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Live-редактирование контента</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadSettings} disabled={saving}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Сохранение..." : "Сохранить все"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Главный экран</TabsTrigger>
          <TabsTrigger value="features">Преимущества</TabsTrigger>
          <TabsTrigger value="cta">CTA блок</TabsTrigger>
          <TabsTrigger value="contacts">Контакты</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Главный экран (Hero)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Подзаголовок (китайский)</Label>
                <Input
                  value={settings.hero_subtitle}
                  onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                  placeholder="茶道 — Путь чая"
                />
              </div>

              <div className="space-y-2">
                <Label>Заголовок</Label>
                <Input
                  value={settings.hero_title}
                  onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                  placeholder="Откройте мир китайского чая"
                />
              </div>

              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={settings.hero_description}
                  onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Изображение Hero</Label>
                <div className="flex gap-2">
                  <Input value={settings.hero_image} onChange={(e) => setSettings({ ...settings, hero_image: e.target.value })} />
                  <Button variant="outline" disabled={uploading} asChild>
                    <label>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? "Загрузка..." : "Загрузить"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "hero_image")}
                      />
                    </label>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid gap-4">
            {[1, 2, 3, 4].map((num) => (
              <Card key={num}>
                <CardHeader>
                  <CardTitle>Преимущество {num}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Заголовок</Label>
                    <Input
                      value={settings[`feature${num}_title` as keyof SiteSettings]}
                      onChange={(e) =>
                        setSettings({ ...settings, [`feature${num}_title`]: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Описание</Label>
                    <Textarea
                      value={settings[`feature${num}_description` as keyof SiteSettings]}
                      onChange={(e) =>
                        setSettings({ ...settings, [`feature${num}_description`]: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cta">
          <Card>
            <CardHeader>
              <CardTitle>CTA блок (Призыв к действию)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Заголовок</Label>
                <Input
                  value={settings.cta_title}
                  onChange={(e) => setSettings({ ...settings, cta_title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={settings.cta_description}
                  onChange={(e) => setSettings({ ...settings, cta_description: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Телефон</Label>
                  <Input
                    value={settings.contact_phone}
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={settings.contact_email}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Адрес</Label>
                  <Input
                    value={settings.contact_address}
                    onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Часы работы</Label>
                  <Input
                    value={settings.contact_hours}
                    onChange={(e) => setSettings({ ...settings, contact_hours: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Данные компании (футер)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Название компании</Label>
                  <Input
                    value={settings.footer_company_name}
                    onChange={(e) => setSettings({ ...settings, footer_company_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ИНН</Label>
                  <Input
                    value={settings.footer_inn}
                    onChange={(e) => setSettings({ ...settings, footer_inn: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ОГРНИП</Label>
                  <Input
                    value={settings.footer_ogrn}
                    onChange={(e) => setSettings({ ...settings, footer_ogrn: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
