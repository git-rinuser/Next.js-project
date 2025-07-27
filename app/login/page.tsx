import { getCurrentUser } from "@/actions/auth-actions"
import { LoginForm } from "@/components/ui/login-form"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "ログイン",
  description: "アカウントにログインしてください",
}

export default async function LoginPage() {
 // 既にログイン済みの場合はユーザー管理ページにリダイレクト
  const { user } = await getCurrentUser()

  if (user) {
    redirect("/User")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 装飾的な背景要素 */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-purple-100/50 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-pink-100/50 blur-3xl" />

      {/* ログインフォーム */}
      <div className="w-full max-w-md px-4 sm:px-0 relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}
