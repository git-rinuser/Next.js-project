import { Button } from '@/components/ui/button'
import { UserTable } from '@/components/ui/user-table'
import Link from 'next/link'
import React, { Suspense } from 'react'

export default function Userpage() {

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>ユーザー管理</h1>
        <Button asChild>
            <Link href="/User/regist">新規ユーザー登録</Link>
        </Button>
      </div>

      <Suspense fallback={<div>ユーザー情報を読み込み中...</div>}>
        <UserTable />
      </Suspense>
    </div>
  )
}

