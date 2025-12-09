"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestUploadPage() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<any>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setResult(null)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      console.log("Uploading:", file.name, file.size, "bytes")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        console.log("Success:", data)
      } else {
        setError(data)
        console.error("Error:", data)
      }
    } catch (err: any) {
      setError({ error: err.message })
      console.error("Exception:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Тест загрузки изображений на S3</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90
                  disabled:opacity-50"
              />
            </div>

            {uploading && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800">⏳ Загрузка...</p>
              </div>
            )}

            {result && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md space-y-2">
                <p className="text-green-800 font-semibold">✅ Успешно загружено!</p>
                <p className="text-sm break-all">
                  <strong>URL:</strong> {result.imageUrl}
                </p>
                {result.imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={result.imageUrl} 
                      alt="Uploaded" 
                      className="max-w-full h-auto rounded-md border"
                    />
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md space-y-2">
                <p className="text-red-800 font-semibold">❌ Ошибка загрузки</p>
                <div className="text-sm space-y-1">
                  <p><strong>Сообщение:</strong> {error.error}</p>
                  {error.details && (
                    <pre className="bg-red-100 p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(error.details, null, 2)}
                    </pre>
                  )}
                  {error.hint && (
                    <p className="text-red-700 mt-2">💡 {error.hint}</p>
                  )}
                  {error.config && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-red-700">Конфигурация S3</summary>
                      <pre className="bg-red-100 p-2 rounded text-xs overflow-auto mt-1">
                        {JSON.stringify(error.config, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📋 Инструкция</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Выберите изображение для загрузки</p>
            <p>2. Если загрузка успешна - увидите URL и превью</p>
            <p>3. Если ошибка - увидите детали проблемы</p>
            <p className="mt-4 text-muted-foreground">
              Эта страница для тестирования. После проверки можно удалить.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
