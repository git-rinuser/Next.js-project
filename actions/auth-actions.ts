"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  error?: string
  token?: string
  user?: any
}

// ログイン処理のサーバーアクション
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const djangoApiUrl = process.env.API_URL

    const response = await fetch(`${djangoApiUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      cache: "no-store",
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.non_field_errors?.[0] || "ログインに失敗しました",
      }
    }

    // トークンをクッキーに保存
    if (data.token) {
      const cookieStore = await cookies()
      cookieStore.set({
        name: "auth_token",
        value: data.token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1週間
      })
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    }
  } catch (error) {
    console.error("ログインエラー:", error)
    return {
      success: false,
      error: "ログイン処理中にエラーが発生しました",
    }
  }
}

// ログアウト処理のサーバーアクション
export async function logout() {
  try {
    const djangoApiUrl = process.env.API_URL

    // Djangoのログアウトエンドポイントを呼び出す（オプション）
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get("auth_token")?.value
      if (token) {
        await fetch(`${djangoApiUrl}/auth/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          cache: "no-store",
        })
      }
    } catch (error) {
      console.error("ログアウトAPI呼び出しエラー:", error)
    }

    // クッキーを削除
    const cookieStore = await cookies()
    cookieStore.delete("auth_token")

    return { success: true }
  } catch (error) {
    console.error("ログアウトエラー:", error)
    return {
      success: false,
      error: "ログアウト処理中にエラーが発生しました",
    }
  }
}

// 現在のユーザー情報を取得するサーバーアクション
export async function getCurrentUser() {
  console.log("getCurrentUser")
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      console.log("token=null")
      return { user: null }
    }

    console.log("tokenあり",token)
    
    const djangoApiUrl = process.env.API_URL

    const response = await fetch(`${djangoApiUrl}/api/v1/auth/user/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.log("トークンが無効です")
      // トークンが無効な場合はクッキーを削除
      if (response.status === 401) {
        const cookieStore = await cookies()
        cookieStore.delete("auth_token")
      }
      return { user: null }
    }

    const user = await response.json()
    console.log("ユーザー情報：",user)
    return { user }
  } catch (error) {
    console.error("ユーザー情報取得エラー:", error)
    return { user: null }
  }
}

// 認証が必要なページで使用する関数
export async function requireAuth() {
  const { user } = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}
