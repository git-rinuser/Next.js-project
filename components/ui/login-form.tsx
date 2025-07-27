"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from 'sonner'
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fetchAPI } from "@/actions/common"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"

// バリデーションスキーマ
const loginFormSchema = z.object({
  email: z.string().email({
    message: "有効なメールアドレスを入力してください。",
  }),
  password: z.string().min(1, {
    message: "パスワードを入力してください。",
  }),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setError(null)
    console.log(data)
    try {
      // Next.jsのAPI Routeを使用してログイン処理
      console.log("ログイン処理")
      const response = await fetch("/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      console.log("ログイン処理結果表示：", result)

      if (!response.ok) {
        setError(
          result.error ||
            result.non_field_errors?.[0] ||
            "ログインに失敗しました。メールアドレスとパスワードを確認してください。",
        )
        return
      }

      toast.success("ログイン成功")

      // ログイン後にダッシュボードまたはホームページにリダイレクト

      router.push("/Home")
      console.log("ログイン処理結果表示：", result)
      router.refresh()
    } catch (error) {
      console.error("ログインエラー:", error)
      setError("ログイン処理中にエラーが発生しました。")
    } finally {
      setIsLoading(false)
    }
  }

  // カードのスタイルを調整して、単独で表示した際により魅力的になるようにします
  return (
    <Card className="w-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-center">ログイン</CardTitle>
        <CardDescription className="text-center text-base">
          アカウント情報を入力してシステムにアクセスしてください
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">メールアドレス</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="email"
                        placeholder="example@example.com"
                        autoComplete="email"
                        className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">パスワード</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="パスワードを入力"
                        autoComplete="current-password"
                        className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>ログイン中...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>ログイン</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">システム管理者の方は適切な認証情報でログインしてください</p>
        </div>
      </CardContent>
    </Card>
  )
}