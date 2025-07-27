"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ErrorSummary } from "@/components/ui/error-summary"
import { updateUser } from "@/actions/user"
import { toast } from "sonner"

//バリデーションスキーマ
const userFormSchema = z.object({
  userNo: z.string().min(1, "ユーザNoは必須です"),
  userName: z.string().min(2,{
      message:"ユーザー名は2文字以上で入力してください"
  }),
  email: z.string().email({
      message: "有効なメールアドレスを入力してください"
  }),
  password: z.string().min(8,{
      message: "パスワードは8文字以上で入力してください"
  }),
  sortNo: z.coerce.number().int(),
  is_active: z.boolean(),
  is_staff: z.boolean(),
  is_superuser: z.boolean(),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface User {
  userNo: string
  userName: string
  email: string
  password: string
  sortNo?: number
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
}

interface UserEditFormProps {
  user: User
}

export function UserEditFormWithSummary({ user }: UserEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [apiErrors, setApiErrors] = useState<Record<string, string[]> | null>(null)

  // デフォルト値を既存のユーザー情報で設定
  const defaultValues: Partial<UserFormValues> = {
    userNo: user.userNo,
    userName: user.userName,
    email: user.email,
    password: user.password,
    sortNo: user.sortNo || 0,
    is_active: user.is_active,
    is_staff: user.is_staff,
    is_superuser: user.is_superuser,
  }

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  })

  async function onSubmit(data: UserFormValues) {
    console.log("onSubmitが呼び出された")
    setIsLoading(true)
    setApiErrors(null) // エラーをリセット

    try {
      console.log("ユーザー更新実行")
      const result = await updateUser(user.userNo, data)

      if (!result.success) {
        // エラーレスポンスの詳細な処理
        if (result.fieldErrors) {
          // フィールド別のエラーがある場合
          setApiErrors(result.fieldErrors)

          // フォームのエラー状態を更新
          Object.keys(result.fieldErrors).forEach((field) => {
            // non_field_errorsはフォームフィールドに関連付けない
            if (field !== "non_field_errors" && field in form.getValues()) {
              form.setError(field as any, {
                type: "manual",
                message: Array.isArray(result.fieldErrors[field])
                  ? result.fieldErrors[field].join(", ")
                  : result.fieldErrors[field],
              })
            }
          })

          throw new Error("入力内容に問題があります。エラー内容を確認してください。")
        } else {
          // 一般的なエラーメッセージ
          throw new Error(result.error)
        }
      }

      toast.success("更新完了")

      // 一覧画面にリダイレクト
      router.push("/User")
      router.refresh()
    } catch (error) {
      console.error("更新エラー:", error)
      toast.error("ユーザー情報の更新に失敗しました")

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ErrorSummary title="更新エラー" errors={apiErrors} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="userNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ユーザーNo</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ユーザー名</FormLabel>
                <FormControl>
                  <Input placeholder="ユーザー名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>パスワード</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sortNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>表示順</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>アクティブ</FormLabel>
                    <FormDescription>ユーザーをアクティブにするかどうか</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_staff"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>スタッフ</FormLabel>
                    <FormDescription>管理画面にアクセスできるスタッフユーザー</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_superuser"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>スーパーユーザー</FormLabel>
                    <FormDescription>すべての権限を持つスーパーユーザー</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "更新中..." : "更新する"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}