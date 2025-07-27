import Link from "next/link"
import { AuthStatus } from "@/components/ui/auth-status"
import { getCurrentUser } from "@/actions/auth-actions"
import { NavMenu } from "./navMenu"


export async function Header() {
  const { user } = await getCurrentUser()
  //const pathname = usePathname()

  console.log("ヘッダー",user)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href={user ? "/User" : "/login"} className="flex items-center space-x-2">
            <span className="font-bold">作業実績管理</span>
          </Link>
        </div>
        <NavMenu />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {user && (
            <nav className="flex items-center space-x-4">
              <Link href="/User" className="text-sm font-medium transition-colors hover:text-primary">
                ユーザー一覧
              </Link>
              <Link href="/User/regist" className="text-sm font-medium transition-colors hover:text-primary">
                ユーザー登録
              </Link>
            </nav>
          )}
          <div className="flex items-center">
            <AuthStatus />
          </div>
        </div>
      </div>
    </header>
  )
}
