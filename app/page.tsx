import { getCurrentUser } from "@/actions/auth-actions"
import { redirect } from "next/navigation"

export default async function HomePage() {
  // 認証状態をチェック
  const { user } = await getCurrentUser()

  console.log("処理スタート")
  console.log(user)

  if (user) {
    // 認証済みの場合はユーザー管理ページにリダイレクト
    redirect("/Home")
  } else {
    // 未認証の場合はログインページにリダイレクト
    redirect("/login")
  }
}