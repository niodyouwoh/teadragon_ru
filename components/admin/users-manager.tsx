"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getLevelName } from "@/lib/levels"

export default function UsersManager() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelBadge = (level: string) => {
    const variants: any = {
      novice: "secondary",
      apprentice: "default",
      sensei: "default",
    }
    return <Badge variant={variants[level] || "secondary"}>{getLevelName(level)}</Badge>
  }

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Пользователи</h2>

      <div className="grid gap-4">
        {users.map((user: any) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{user.username}</h3>
                  {user.name && <p className="text-sm text-muted-foreground">{user.name}</p>}
                </div>
                {getLevelBadge(user.level)}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Бонусы:</span> {user.bonus_points}
                </div>
                <div>
                  <span className="text-muted-foreground">Потрачено:</span> {user.total_spent} ₽
                </div>
                {user.phone && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Телефон:</span> {user.phone}
                  </div>
                )}
                <div className="col-span-2 text-xs text-muted-foreground">
                  Регистрация: {new Date(user.created_at).toLocaleDateString("ru-RU")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
