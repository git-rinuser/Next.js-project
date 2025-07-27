"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ErrorSummaryProps {
  title?: string
  errors: Record<string, string[]> | null
}

export function ErrorSummary({ title = "エラーが発生しました", errors }: ErrorSummaryProps) {
  if (!errors || Object.keys(errors).length === 0) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-5 mt-2">
          {Object.entries(errors).map(([field, messages]) => (
            <li key={field} className="mt-1">
              <strong>{getFieldLabel(field)}:</strong> {Array.isArray(messages) ? messages.join(", ") : messages}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}

// フィールド名を日本語に変換する関数
function getFieldLabel(field: string): string {
  const fieldLabels: Record<string, string> = {
    userNo: "ユーザーNo",
    userName: "ユーザー名",
    email: "メールアドレス",
    password: "パスワード",
    sortNo: "表示順",
    is_active: "アクティブ",
    is_staff: "スタッフ",
    is_superuser: "スーパーユーザー",
    non_field_errors: "全体エラー",
  }

  return fieldLabels[field] || field
}
