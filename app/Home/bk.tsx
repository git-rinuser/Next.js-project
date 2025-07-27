
import { Button } from '@/components/ui/button'
import { LogIn, UserPlus, Users, Bell } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-extrabold">勤務実績入力システム</h1>
          <p className="mt-3 text-lg text-muted-foreground">Djangoバックエンドと連携したNext.jsアプリケーション</p>
        </div>

        <div className="flex flex-col space-y-4 mt-8">
          <Link href="/Process">
            <Button className="w-full" size="lg">
              <Users className="mr-2 h-5 w-5" />
              工程マスタ
            </Button>
          </Link>

          <Link href="/Category">
            <Button className="w-full" variant="outline" size="lg">
              <Bell className="mr-2 h-5 w-5" />
              作業分類マスタ
            </Button>
          </Link>

          <Link href="/User">
            <Button className="w-full" variant="secondary" size="lg">
              <LogIn className="mr-2 h-5 w-5" />
              ユーザーマスタ
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          このアプリケーションはDjangoバックエンドと連携して動作します。
          ユーザーの登録、編集、削除、認証などの機能を提供します。
        </p>
      </div>
    </div>
  )
}

