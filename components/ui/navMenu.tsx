"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Briefcase, Calendar, FileText, Home, Layers, Settings, User } from "lucide-react"

export function NavMenu() {
  const pathname = usePathname()
  
  const navItems = [
  {name: "ホーム", href: "/Home", icon: Home},
  {name: "作業実績", href: "/work-records", icon: Calendar},
  {name: "顧客", href: "/Customer", icon: Briefcase},
  {name: "プロジェクト", href: "/projects", icon: FileText},
  {name: "カテゴリ", href: "/Category", icon: Layers},
  {name: "プロセス", href: "/Process", icon: BarChart3},
  {name: "ユーザー", href: "/User", icon: User},
  {name: "設定", href: "/settings", icon: Settings}
]

  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = item.icon
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
              isActive
                ? "border-indigo-500 text-gray-900"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
            )}
          >
            <Icon className="h-4 w-4 mr-1" />
            {item.name}
          </Link>
        )
      })}
    </div>
  )
}