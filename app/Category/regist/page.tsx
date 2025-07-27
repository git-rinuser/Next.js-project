"use client"

import { CategoryType, deleteCategory, PostCategory } from '@/actions/category'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function registCategoryHome() {

  const [newCategory, setNewCategory] = useState<CategoryType>({
    categoryNo:"",
    categoryName:""
  })  

  const handleInputChangeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCategory((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCategory = async() => {
    console.log("作業分類を登録します")
    if(!newCategory.categoryNo || !newCategory.categoryName){
        toast.error("作業分類IDと作業分類名を入力してください")
        return 
    }

    try{
        const res = await PostCategory(newCategory)

        if(res.success){
            toast.success("作業分類マスタの登録に成功しました")
            setNewCategory({categoryNo:"", categoryName:""})
        }else{
            toast.error("作業分類マスタの登録に失敗しました")
        }
    }catch(error){
        toast.error(error instanceof Error ? error.message : "作業分類マスタの登録に失敗しました")
    }
  }

  return (
    <div>
        <h2>作業分類マスタ登録</h2>
        <label>作業分類ID</label>
        <Input  id='categoryNo'
                name='categoryNo'
                value={newCategory.categoryNo}
                onChange={handleInputChangeCategory}
                placeholder='categoryNo' />
        <label>作業分類名</label>
        <Input  id='categoryName'
                name='categoryName'
                value={newCategory.categoryName}
                onChange={handleInputChangeCategory}
                placeholder='categoryName' />
                
        <Button onClick={handleAddCategory}>
            登録
        </Button>
        <Button asChild>
            <Link href="/Category">戻る</Link>
        </Button>
    </div>
  )
}

