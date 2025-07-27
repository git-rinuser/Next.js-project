import { getUserById } from '@/actions/user'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { UserDeleteButton } from '@/components/ui/user-delete-button'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

interface userDetailPageProds {
  params: {
    id: string
  }
}

export default async function UserDetailPage({ params }: userDetailPageProds){
  const userNo = Number.parseInt(params.id)

  if(isNaN(userNo)){
    notFound()
  }

  const { success, user } = await getUserById(userNo)

  if(!success || !user){
    notFound()
  }


  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <Link href="/User" className="flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          ユーザー一覧に戻る
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>ユーザー詳細</CardTitle>
            <CardDescription>ユーザーID: {user.userNo}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">ユーザー名</h3>
              <p>{user.userName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">メールアドレス</h3>
              <p>{user.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">表示順</h3>
              <p>{user.sortNo || 0}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">ステータス</h3>
              {user.is_active ? (
                <Badge variant="default" className="bg-green-500">
                  アクティブ
                </Badge>
              ) : (
                <Badge variant="outline">非アクティブ</Badge>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium">権限</h3>
              <div className="flex gap-2 mt-1">
                {user.is_superuser && <Badge className="bg-purple-500">スーパーユーザー</Badge>}
                {user.is_staff && <Badge className="bg-blue-500">スタッフ</Badge>}
                {!user.is_superuser && !user.is_staff && <Badge variant="outline">一般ユーザー</Badge>}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/User/${user.userNo}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                編集
              </Button>
            </Link>
            <UserDeleteButton userNo={user.userNo} userName={user.userName} />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

