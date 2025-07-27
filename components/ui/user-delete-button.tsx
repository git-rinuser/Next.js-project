"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { deleteUser } from "@/actions/user"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface UserDeleteButtonProds{
    userNo: string
    userName: string
}

export function UserDeleteButton({userNo, userName}: UserDeleteButtonProds){
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    async function handleDelete(userNo: string){
        console.log("ユーザーを削除します")
        setIsDeleting(true)
        try{
            const result = await deleteUser(userNo)
            if(result.success){
                toast("ユーザーの削除に成功しました")
                setTimeout(() => {
                    router.push("/User/")
                }, 1500)
            }else{
                toast.error("ユーザーの削除に失敗しました")
            }
        }catch(error){
            toast.error(error instanceof Error ? error.message : "ユーザーの削除に失敗しました")
        }finally{
            setIsDeleting(false)
            setOpen(false)
        }
    }

    return (
        <div>
            <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
                <Trash2 className="h-4 w-4 text-red-500" />
            </Button>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ユーザーを削除しますか？</AlertDialogTitle>
                        <AlertDialogDescription>
                            ユーザー「{userName}」を削除します。この操作は元に戻せません。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete(userNo)
                            }}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            {isDeleting ? "削除中..." : "削除する"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}