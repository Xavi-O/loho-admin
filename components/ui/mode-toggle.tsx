"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { Laptop2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function ModeToggle() {
  const { setTheme, theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = theme === "system" ? systemTheme : theme

  if (!mounted) return null

  const items = [
    { label: <Laptop2 className="w-4 h-4" />, value: "system" },
    { label: <Sun className="w-4 h-4" />, value: "light" },
    { label: <Moon className="w-4 h-4" />, value: "dark" },
  ]

  return (
    <div className="flex items-center gap-0.5 rounded-full border px-1 py-1 bg-background text-muted-foreground">
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => setTheme(item.value)}
          className={cn(
            "flex items-center justify-center w-6 h-6 rounded-full transition-all",
            theme === item.value ||
              (item.value === "system" && theme === "system")
              ? "bg-muted text-foreground"
              : "hover:bg-muted/50"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
