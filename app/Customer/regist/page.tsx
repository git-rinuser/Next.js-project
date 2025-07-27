"use client"

import { CustomerType, PostCustomer } from "@/actions/customer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import Link from "next/link"
import React, { useState } from "react"
import { toast } from "sonner"

export default function registCustomerHome() {

    const [newCustomer, setNewCustomer ] = useState<CustomerType>({
        customerNo : 0,
        customerName : "",
    })

    const handleInputChangeCustomer = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewCustomer((prev) => ({ ...prev, [name]: value}))
    }

    const handleAddCutomer = async() => {
        if(!newCustomer.customerNo || !newCustomer.customerName){
            toast.error("顧客番号と顧客名を入力してください")
            return
        }

        try{
            const res = await PostCustomer(newCustomer)

            if(res.success){
                toast.success("顧客マスタの登録に成功しました")
                setNewCustomer({customerNo:0, customerName:"" })
            }else{
                toast.error("顧客マスタの登録に失敗しました")
                return
            }
        }catch(error){
            toast.error(error instanceof Error ? error.message : "顧客マスタの登録に失敗しました")
            return
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">顧客マスタ登録</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="customerNo">顧客番号</Label>
                        <Input  id='customerNo'
                                name='customerNo'
                                value={newCustomer.customerNo}
                                onChange={handleInputChangeCustomer}
                                placeholder='customerNo' 
                        />
                    </div>
                    <div>
                        <Label htmlFor="customerName">顧客名</Label>
                        <Input  id='customerName'
                                name='customerName'
                                value={newCustomer.customerName}
                                onChange={handleInputChangeCustomer}
                                placeholder='customerName' 
                        />
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button onClick={handleAddCutomer}>登録</Button>
                        <Button variant="outline" asChild>
                            <Link href="/Customer">戻る</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>  
        </div>
    )       
}
