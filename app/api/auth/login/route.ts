import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    console.log("POST処理実行")
    const credentials = await request.json()

    // Django APIのエンドポイント
    const djangoApiUrl = process.env.API_URL

    // Djangoバックエンドにリクエストを転送
    const response = await fetch(`${djangoApiUrl}/api/v1/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    console.log(data.token)

    // トークンをクッキーに保存
    if (data.token) {
      console.log("トークンをクッキーに保存")
      const cookieStore = await cookies()
      cookieStore.set({
        name: "auth_token",
        value: data.token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1週間
      })
      console.log(cookieStore)
    }

    return NextResponse.json(
      {
        success: true,
        user: data.user,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("ログインエラー:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}
