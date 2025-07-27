"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { toast } from "sonner"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function LogoutButton({ variant = "outline", size = "default" }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success("正常にログアウトしました")

        router.push("/login")
        router.refresh()
      } else {
        throw new Error(result.error || "ログアウトに失敗しました")
      }
    } catch (error) {
      console.error("ログアウトエラー:", error)
      toast.error("ログアウト処理中にエラーが発生しました")

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout} disabled={isLoading}>
      {isLoading ? (
        "ログアウト中..."
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          ログアウト
        </>
      )}
    </Button>
  )
}
