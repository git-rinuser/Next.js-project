"use client"

import { CategoryType, deleteCategory, getCategoryList, PostCategory, putCategory } from '@/actions/category'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function CategoryHome() {

  const [categories, setCategories] = useState<CategoryType[]>([])

  const [editCategory, setEditCategory] = useState<CategoryType | null>(null)

  const [isRegistering, setIsRegistering] = useState(false)

  const [newCategory, setNewCategory] = useState<CategoryType>({
    categoryNo:"",
    categoryName:""
  })  

  const handleChangeCategoryName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(editCategory) {
      setEditCategory({...editCategory, categoryName : e.target.value})
    }
  }

  const handleInputChangeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setNewCategory((prev) => ({ ...prev, [name]: value }))
    }

  const getCategories = async() => {
    const { success, categories } = await getCategoryList()

    if (success) {
        setCategories(categories)
    }else{
        toast.error("作業分類一覧の取得に失敗しました")
    }
  }  

  const handleDeleteCategory = async(categoryNo: string) => {
    console.log("作業分類マスタを削除します")

    try{
      const res = await deleteCategory(categoryNo)

      if(res.success){
        toast.success("作業分類マスタの削除に成功しました")
        getCategories()
      } else {
        toast.error("作業分類マスタの削除に失敗しました")
      }
    }catch(error){
      toast.error(error instanceof Error ? error.message : "作業分類マスタの削除に失敗しました")
    }
  }

  const handleEditCategory = async(category: CategoryType) => {
    setEditCategory(category)
  }

  const handleUpdateCategory = async () => {
    if(!editCategory?.categoryNo || !editCategory?.categoryName){
      toast.error("作業分類が空です")
      return
    }

    try{
      const res = await putCategory(editCategory)
      if(res.success){
        toast.success("更新に成功しました")
        setEditCategory(null)
        getCategories()
      }else{
        toast.error("更新に失敗しました")
      }
    }catch(error){
      toast.error(error instanceof Error ? error.message : "作業分類マスタの更新に失敗しました")
    }
  }

  const handleAddCategory = async() => {
      console.log("作業分類を登録します")
      if(!newCategory.categoryNo || !newCategory.categoryName){
          toast.error("作業分類IDと作業分類名を入力してください")
          return 
      }
  
      try{
          const res = await PostCategory(newCategory)
          console.log("登録レスポンス:", res)
          if(res.success){
              toast.success("作業分類マスタの登録に成功しました")
              setNewCategory({categoryNo:"", categoryName:""})
              setIsRegistering(false)
              getCategories()
          }else{
              toast.error("作業分類マスタの登録に失敗しました")
              return
          }
      }catch(error){
          toast.error(error instanceof Error ? error.message : "作業分類マスタの登録に失敗しました")
      }
  }

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <div className="container mx-auto">
      <h2>作業分類一覧</h2>

      <Table className='rounded-md border'>
        <TableBody>
        {categories.map((category) => (
            <TableRow key={category.categoryNo}>
                <TableCell>{category.categoryNo}</TableCell>
                <TableCell>{category.categoryName}</TableCell>
                <TableCell><Button variant="destructive" onClick={() => handleDeleteCategory(category.categoryNo)}>削除</Button></TableCell>
                <TableCell><Button variant="outline" onClick={() => handleEditCategory(category)}>編集</Button></TableCell>
            </TableRow>
        ))}
        </TableBody>
      </Table>

      {editCategory && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-bold mb-2">作業分類を編集</h3>
          <p className='text-sm text-gray-600 mb-1'>作業分類：{editCategory.categoryNo}</p>
          <input
             className='border rounded px-2 py-1 w-full mb-2'
             value={editCategory.categoryName}
             onChange={handleChangeCategoryName}
          />
          <div className='flex gap-2'>
            <Button onClick={handleUpdateCategory}>更新</Button>
            <Button variant="ghost" onClick={() => setEditCategory(null)}>キャンセル</Button>
          </div>
        </div>
      )}

      <Button className='mt-6' onClick={() => setIsRegistering(true)}>
        作業分類追加
      </Button>

      <Button asChild className='mt-6'>
        <Link href="/">戻る</Link>
      </Button>

      {isRegistering && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-bold mb-2">新規作業分類登録</h3>
          <Input
            id="categoryNo"
            name="categoryNo"
            className="border rounded px-2 py-1 w-full mb-2"
            placeholder="作業分類ＩＤ"
            value={newCategory.categoryNo}
            onChange={handleInputChangeCategory}
          />
          <Input
            id="categoryName"
            name="categoryName"
            className="border rounded px-2 py-1 w-full mb-2"
            placeholder="作業分類名"
            value={newCategory.categoryName}
            onChange={handleInputChangeCategory}
          />
          <div className="flex gap-2">
            <Button onClick={handleAddCategory}>登録</Button>
            <Button variant="ghost" onClick={() => setIsRegistering(false)}>
              キャンセル
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}

