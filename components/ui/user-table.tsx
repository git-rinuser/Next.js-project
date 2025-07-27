//import { UserDeleteButton } from "@/components/user-delete-button"
//import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Edit, Eye } from "lucide-react"
import { getUserList } from "@/actions/user"
import { Button } from "./button"
import { UserDeleteButton } from "./user-delete-button"

export async function UserTable() {
  const { success, users } = await getUserList()

  console.log("ユーザ情報取得")

  if (!success) {
    return <div className="p-4 bg-red-50 text-red-500 rounded-md">{success}</div>
  }

  if (!users || users.length === 0) {
    return <div className="text-center p-4">ユーザーが登録されていません。</div>
  }

  return (
    <div>
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>ユーザーNo</TableHead>
                    <TableHead>ユーザー名</TableHead>
                    <TableHead>メールアドレス</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>権限</TableHead>
                    <TableHead className="text-right">アクション</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {users.map((user) => (
                    <TableRow key={user.userNo}>
                    <TableCell>{user.userNo}</TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        {user.is_active ? (
                        <Badge variant="default" className="bg-green-500">
                            アクティブ
                        </Badge>
                        ) : (
                        <Badge variant="outline">非アクティブ</Badge>
                        )}
                    </TableCell>
                    <TableCell>
                        {user.is_superuser ? (
                        <Badge className="bg-purple-500">スーパーユーザー</Badge>
                        ) : user.is_staff ? (
                        <Badge className="bg-blue-500">スタッフ</Badge>
                        ) : (
                        <Badge variant="outline">一般ユーザー</Badge>
                        )}
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                        <Link href={`/User/${user.userNo}`}>
                            <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href={`/User/${user.userNo}/edit`}>
                            <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                        <UserDeleteButton userNo={user.userNo} userName={user.userName} />
                        </div>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>

        <Button asChild>
            <Link href="/Home">戻る</Link>
        </Button>
    </div>
  )
}
