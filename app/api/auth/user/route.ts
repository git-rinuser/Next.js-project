import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "認証されていません" }, { status: 401 })
    }

    // Django APIのエンドポイント
    const djangoApiUrl = process.env.API_URL

    // Djangoバックエンドにリクエストを転送
    const response = await fetch(`${djangoApiUrl}/api/v1/auth/user/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    if (!response.ok) {
      // トークンが無効な場合はクッキーを削除
      if (response.status === 401) {
        cookieStore.delete("auth_token")
      }

      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    const userData = await response.json()
    return NextResponse.json(userData, { status: 200 })
  } catch (error) {
    console.error("ユーザー情報取得エラー:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}