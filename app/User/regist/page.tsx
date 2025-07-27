"use client"

import { registUser } from '@/actions/user'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { fields } from '@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const registUserpage = () => {

  const [isLoading, setIsLoading] = useState(false)

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

  const defaultValues: UserFormValues = {
    userNo: "",
    userName: "",
    email: "",
    password: "",
    sortNo: 0,
    is_active: true,
    is_staff: false,
    is_superuser: false,
  }

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  })

  const onSubmit = async(data: UserFormValues) => {
    toast.success("処理中")
    setIsLoading(true)
    
    try{
      const response = await registUser(data)

      if(response.success){
        toast.success("ユーザマスタの登録に成功しました")
      }else{
        const errors = response.data
        if(errors && typeof errors === "object"){
          Object.entries(errors).forEach(([field, messages]) => {
            if(Array.isArray(messages)){
              messages.forEach(msg => {
                toast.error(`${field}: ${msg}`)
              })
            }
          })
        }else{
          toast.error("予期しないエラーが発生しました")
        }
      }
    }catch(error){
      toast.error(error instanceof Error ? error.message : "ユーザマスタの登録に失敗しました")
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='max-w-md mx-auto'>
        <h2>ユーザ登録</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ユーザNo</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "登録中..." : "ユーザー登録"}
            </Button>

            <Button asChild className="w-full">
                <Link href="/User">戻る</Link>
            </Button>
         </form>
        </Form> 
        </div>
    </div>
  )
}

export default registUserpage
