// PostgreSQL database implementation
export * from './db-postgres'

// Initialize database on server startup
if (typeof window === "undefined") {
  import('./db-postgres').then(db => {
    db.initDatabase().catch(console.error)
  })
}

// Функции для работы с уровнями пользователей
export function getUserLevel(totalSpent: number): string {
  if (totalSpent >= 50000) return "sensei" // Сенсей - 15% скидка
  if (totalSpent >= 20000) return "apprentice" // Подмастерье - 10% скидка
  return "novice" // Новичок - 0% скидка
}

export function getDiscount(level: string): number {
  switch (level) {
    case "sensei":
      return 15
    case "apprentice":
      return 10
    default:
      return 0
  }
}

export function getLevelName(level: string): string {
  switch (level) {
    case "sensei":
      return "Сенсей"
    case "apprentice":
      return "Подмастерье"
    default:
      return "Новичок"
  }
}

export function getNextLevelInfo(level: string, totalSpent: number) {
  if (level === "sensei") {
    return { nextLevel: null, remaining: 0, progress: 100 }
  }
  if (level === "apprentice") {
    return {
      nextLevel: "sensei",
      remaining: 50000 - totalSpent,
      progress: (totalSpent / 50000) * 100,
    }
  }
  return {
    nextLevel: "apprentice",
    remaining: 20000 - totalSpent,
    progress: (totalSpent / 20000) * 100,
  }
}
