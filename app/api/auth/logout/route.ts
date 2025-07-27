import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    // トークンを取得
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (token) {
      // Django APIのエンドポイント
      const djangoApiUrl = process.env.API_URL

      // Djangoバックエンドにリクエストを転送
      try {
        await fetch(`${djangoApiUrl}/api/v1/auth/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        })
      } catch (error) {
        console.error("Django logout error:", error)
        // Django側のエラーは無視して続行
      }
    }

    // クッキーを削除
    cookieStore.delete("auth_token")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("ログアウトエラー:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}