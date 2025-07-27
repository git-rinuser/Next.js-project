import { getUserById } from "@/actions/user"
import { UserEditFormWithSummary } from "@/components/ui/user-edit-form-with-summary"
import { notFound } from "next/navigation"

interface UserEditPageProps {
    params: {
        id: string
    }
}

export default async function UserEditPage({ params }: UserEditPageProps) {
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
            <h1 className="text-2xl font-bold mb-6">ユーザー編集</h1>
            <UserEditFormWithSummary user={user} />
          </div>
        </div>
    )
}