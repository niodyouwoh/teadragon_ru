"use client"

import { createContext, useContext, type ReactNode } from "react"

// Простой контекст для совместимости, основная логика теперь в API
const UserContext = createContext<any>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  return <UserContext.Provider value={{}}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}
