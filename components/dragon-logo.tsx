"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface DragonLogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
}

export function DragonLogo({ className = "", size = "md", animated = true }: DragonLogoProps) {
  const sizes = {
    sm: { className: "w-8 h-8", width: 32, height: 32 },
    md: { className: "w-12 h-12", width: 48, height: 48 },
    lg: { className: "w-20 h-20", width: 80, height: 80 },
    xl: { className: "w-32 h-32", width: 128, height: 128 },
  }

  const currentSize = sizes[size]

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`${currentSize.className} ${className}`}
      >
        <Image
          src="/images/dragon-logo.png"
          alt="Чайный Дракон"
          width={currentSize.width}
          height={currentSize.height}
          className="w-full h-full object-contain"
          priority
        />
      </motion.div>
    )
  }

  return (
    <div className={`${currentSize.className} ${className}`}>
      <Image
        src="/images/dragon-logo.png"
        alt="Чайный Дракон"
        width={currentSize.width}
        height={currentSize.height}
        className="w-full h-full object-contain"
      />
    </div>
  )
}
