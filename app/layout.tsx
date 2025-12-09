import type React from "react"
import type { Metadata } from "next"
import { Noto_Serif, Noto_Serif_SC } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { UserProvider } from "@/lib/user-context"

const notoSerif = Noto_Serif({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  display: "swap",
})

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chinese",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Чайный Дракон | Элитный китайский чай в Брянске",
  description:
    "Магазин традиционного китайского чая и чайной посуды. Широкий выбор пуэров, улунов, белого и зеленого чая. Доставка по Брянску и области.",
  keywords: "чай, китайский чай, пуэр, улун, чайный магазин, Брянск, чайная посуда, гайвань",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${notoSerif.variable} ${notoSerifSC.variable} font-serif antialiased`}>
        <UserProvider>
          <CartProvider>{children}</CartProvider>
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
