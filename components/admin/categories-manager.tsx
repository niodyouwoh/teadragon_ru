"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Upload } from "lucide-react"
import Image from "next/image"
import { categories } from "@/lib/products"

interface CategoryImage {
  id: string
  image: string
}

export default function CategoriesManager() {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    loadCategoryImages()
  }, [])

  const loadCategoryImages = async () => {
    try {
      const response = await fetch("/api/settings")
      const data = await response.json()
      
      if (data.settings) {
        const images: Record<string, string> = {}
        categories.forEach((cat) => {
          if (cat.id !== "all") {
            images[cat.id] = data.settings[`category_${cat.id}_image`] || `/placeholder.svg?height=200&width=200&query=${cat.name}`
          }
        })
        setCategoryImages(images)
      }
    } catch (error) {
      console.error("Ошибка загрузки изображений категорий:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (categoryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(categoryId)
    try {
      const formData = new FormData()
      formData.append("file", file)

      console.log("📤 Загрузка изображения для категории на S3:", categoryId)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.imageUrl) {
        console.log("✅ Изображение загружено на S3:", data.imageUrl)
        setCategoryImages({ ...categoryImages, [categoryId]: data.imageUrl })
        alert("Изображение успешно загружено на S3!")
      } else {
        alert(`Ошибка загрузки: ${data.error || "Не удалось загрузить изображение"}`)
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки изображения:", error)
      alert("Ошибка загрузки изображения на S3. Проверьте настройки S3.")
    } finally {
      setUploading(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const settings: Record<string, string> = {}
      Object.entries(categoryImages).forEach(([categoryId, image]) => {
        settings[`category_${categoryId}_image`] = image
      })

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert("Изображения категорий успешно сохранены! Обновите главную страницу чтобы увидеть изменения.")
      } else {
        alert("Ошибка сохранения")
      }
    } catch (error) {
      console.error("Ошибка:", error)
      alert("Ошибка подключения к серверу")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Изображения категорий</h2>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Сохранение..." : "Сохранить все"}
        </Button>
      </div>

      <div className="grid gap-4">
        {categories
          .filter((cat) => cat.id !== "all")
          .map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {category.name} <span className="text-sm text-muted-foreground ml-2">{category.nameZh}</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <Image
                      src={categoryImages[category.id] || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>URL изображения</Label>
                    <Input
                      value={categoryImages[category.id] || ""}
                      onChange={(e) => setCategoryImages({ ...categoryImages, [category.id]: e.target.value })}
                      placeholder="/placeholder.svg"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={uploading === category.id}
                        asChild
                      >
                        <label className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading === category.id ? "Загрузка..." : "Загрузить"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(category.id, e)}
                          />
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="bg-secondary/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Совет:</strong> Используйте квадратные изображения размером минимум 400x400px для лучшего отображения.
        </p>
      </div>
    </div>
  )
}
