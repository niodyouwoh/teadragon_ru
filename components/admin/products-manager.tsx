"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Upload } from "lucide-react"
import { categories } from "@/lib/products"
import Image from "next/image"

export default function ProductsManager() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data.products)
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      console.log("📤 Загрузка изображения на S3:", file.name, file.size, "bytes")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.imageUrl) {
        console.log("✅ Изображение загружено на S3:", data.imageUrl)
        setEditingProduct({ ...editingProduct, image: data.imageUrl })
        alert("Изображение успешно загружено на S3!")
      } else {
        console.error("❌ Ошибка загрузки:", data.error)
        alert(`Ошибка загрузки: ${data.error || "Не удалось загрузить изображение"}`)
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки изображения:", error)
      alert("Ошибка загрузки изображения на S3. Проверьте настройки S3.")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      // Проверяем, что это существующий товар (редактирование)
      const isExisting = products.some((p) => p.id === editingProduct.id)
      const method = isExisting ? "PUT" : "POST"

      // Если новый товар, генерируем уникальный ID
      const productToSave = {
        ...editingProduct,
        id: isExisting ? editingProduct.id : `product-${Date.now()}`,
      }

      const response = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToSave),
      })

      if (response.ok) {
        await loadProducts()
        setIsDialogOpen(false)
        setEditingProduct(null)
        alert("Товар успешно сохранен!")
      } else {
        const data = await response.json()
        alert(`Ошибка: ${data.error || "Не удалось сохранить товар"}`)
      }
    } catch (error) {
      console.error("Ошибка сохранения товара:", error)
      alert("Ошибка подключения к серверу")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить товар?")) return

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadProducts()
      }
    } catch (error) {
      console.error("Ошибка удаления товара:", error)
    }
  }

  const openNewProduct = () => {
    setEditingProduct({
      id: "", // Пустой ID для нового товара
      name: "",
      nameZh: "",
      category: "puer",
      price: 0,
      weight: "",
      description: "",
      origin: "",
      image: "/placeholder.svg",
      inStock: true,
      isNew: false,
      isBestseller: false,
    })
    setIsDialogOpen(true)
  }

  const openEditProduct = (product: any) => {
    setEditingProduct({
      ...product,
      inStock: product.in_stock === 1,
      isNew: product.is_new === 1,
      isBestseller: product.is_bestseller === 1,
      nameZh: product.name_zh,
      oldPrice: product.old_price,
    })
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Управление товарами</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewProduct}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить товар
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct?.id ? "Редактировать товар" : "Новый товар"}</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Название</Label>
                    <Input
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Название (китайский)</Label>
                    <Input
                      value={editingProduct.nameZh}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nameZh: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Категория</Label>
                    <Select
                      value={editingProduct.category}
                      onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((c) => c.id !== "all")
                          .map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Цена (₽)</Label>
                    <Input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Вес</Label>
                    <Input
                      value={editingProduct.weight}
                      onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Происхождение</Label>
                    <Input
                      value={editingProduct.origin}
                      onChange={(e) => setEditingProduct({ ...editingProduct, origin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Год (опционально)</Label>
                    <Input
                      type="number"
                      value={editingProduct.year || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, year: Number(e.target.value) || null })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Изображение</Label>
                  <div className="flex gap-4 items-center">
                    {editingProduct.image && (
                      <Image
                        src={editingProduct.image}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="rounded object-cover"
                      />
                    )}
                    <div>
                      <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                      {uploading && <p className="text-sm text-muted-foreground mt-1">Загрузка...</p>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    />
                    <span className="text-sm">В наличии</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingProduct.isNew}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                    />
                    <span className="text-sm">Новинка</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingProduct.isBestseller}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })}
                    />
                    <span className="text-sm">Хит продаж</span>
                  </label>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleSave}>Сохранить</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <Image
                src={product.image}
                alt={product.name}
                width={80}
                height={80}
                className="rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.category} • {product.weight} • {product.price} ₽
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditProduct(product)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
