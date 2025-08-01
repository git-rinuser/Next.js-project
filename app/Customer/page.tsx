"use client"

import { CustomerType, DeleteCustomer, getCutomerList, PostCustomer, PutCustomer } from '@/actions/customer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function CustomerHome() {

  const [customers, setCustomers] = useState<CustomerType[]>([])

  const [editCustomer, setEditCustomer] = useState<CustomerType | null>(null)

  const [isRegistering, setIsRegistering] = useState(false)

  const [newCustomer, setNewCustomer] = useState<CustomerType>({
    customerNo : 0,
    customerName : "",
  })

  const handleChangeCustomerName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(editCustomer) {
      setEditCustomer({...editCustomer, customerName : e.target.value})
    }
  }

  const handleInputChangeCustomer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCustomer((prev) => ({ ...prev, [name]: value }))
  }

  const getCustomers = async() => {
    const { success, customers } = await getCutomerList()

    if (success) {
      setCustomers(customers)
    } else {
      toast.error("顧客一覧の取得に失敗しました")
    }
  }

  const handleDeleteCustomer = async(customerNo : number) => {
    try{
      const res = await DeleteCustomer(customerNo)

      if(res.success){
        toast.success("顧客マスタの削除に成功しました")
        getCustomers()
      } else {
        toast.error("顧客マスタの削除に失敗しました")
      }
    }catch(error){
      toast.error(error instanceof Error ? error.message : "顧客マスタの削除に失敗しました")
    }
  }

  const handleEditCustomer = async(customer: CustomerType) => {
    setEditCustomer(customer)
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
          setIsRegistering(false)
          getCustomers()
        }else{
          toast.error("顧客マスタの登録に失敗しました")
          return
        }
      }catch(error){
        toast.error(error instanceof Error ? error.message : "顧客マスタの登録に失敗しました")
        return
      }
    }

    const handleUpdateCustomer = async () =>  {
    if(!editCustomer?.customerNo || !editCustomer?.customerName){
      toast.error("顧客Noが空です")
      return
    }

    try{
      const res = await PutCustomer(editCustomer)
      if(res.success){
        toast.success("更新に成功しました")
        setEditCustomer(null)
        getCustomers()
      }else{
        toast.error("更新に失敗しました")
      }
    }catch(error){
      toast.error(error instanceof Error ? error.message : "顧客マスタの更新に失敗しました")
    }
  }

  useEffect(() => {
    getCustomers()
  }, [])

  return (
    <div className="container mx-auto">
      <h2>顧客一覧</h2>

      <Table className='rounded-md border'>
        <TableHeader>
          <TableRow>
            <TableHead>顧客No</TableHead>
            <TableHead>顧客名</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {customers.map((customer) => (
            <TableRow key={customer.customerNo}>
                <TableCell>{customer.customerNo}</TableCell>
                <TableCell>{customer.customerName}</TableCell>
                <TableCell><Button variant="destructive" onClick={() => handleDeleteCustomer(customer.customerNo)}>削除</Button></TableCell>
                <TableCell><Button variant="outline" onClick={() => handleEditCustomer(customer)}>編集</Button></TableCell>
            </TableRow>
        ))}
        </TableBody>
      </Table>

      {editCustomer && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-bold mb-2">顧客を編集</h3>
          <p className='text-sm text-gray-600 mb-1'>顧客番号：{editCustomer.customerNo}</p>
          <input
             className='border rounded px-2 py-1 w-full mb-2'
             value={editCustomer.customerName}
             onChange={handleChangeCustomerName}
          />
          <div className='flex gap-2'>
            <Button onClick={handleUpdateCustomer}>更新</Button>
            <Button variant="ghost" onClick={() => setEditCustomer(null)}>キャンセル</Button>
          </div>
        </div>
      )}

      <Button className='mt-6' onClick={() => setIsRegistering(true)}>
        顧客番号追加
      </Button>

      <Button asChild className='mt-6'>
        <Link href="/">戻る</Link>
      </Button>

      {isRegistering && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-bold mb-2">新規顧客登録</h3>
          <Input
            id="customerNo"
            name="customerNo"
            className="border rounded px-2 py-1 w-full mb-2"
            placeholder="顧客番号"
            value={newCustomer.customerNo}
            onChange={handleInputChangeCustomer}
          />
          <Input
            id="customerName"
            name="customerName"
            className="border rounded px-2 py-1 w-full mb-2"
            placeholder="顧客名"
            value={newCustomer.customerName}
            onChange={handleInputChangeCustomer}
          />
          <div className="flex gap-2">
            <Button onClick={handleAddCutomer}>登録</Button>
            <Button variant="ghost" onClick={() => setIsRegistering(false)}>
              キャンセル
            </Button>
          </div>
        </div>
      )
      }
    </div>
  )
}