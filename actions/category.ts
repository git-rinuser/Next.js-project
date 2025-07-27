"use server"

import { fetchAPI } from "./common"

//Categoryの型　項目定義
export interface CategoryType {
    categoryNo: string
    categoryName: string
}

//作業分類取得
export const getCategoryList = async() => {
    //options設定
    const options: RequestInit = {
        method : "GET",
        cache :  "no-store",
    }

    //作業分類一覧取得
    const response = await fetchAPI("/api/v1/category/", options)
    if(!response.success){
        console.error(response.error)
        return { success:false, categories:[] }
    }

    const categories: CategoryType[] = response.data
    return { success: true, categories}
}

//作業分類追加
export const PostCategory = async (newCategory: CategoryType) => {
    //options設定
    const options: RequestInit = {
        method : "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body : JSON.stringify(newCategory)
    }

    //作業分類追加
    const response = await fetchAPI("/api/v1/category/", options)
    if(!response.success){
        console.error("登録失敗", response.error)
        return { success: false}
    }

    return { success: true, data: response.data }
}

//作業分類削除
export const deleteCategory = async (categoryNo: string) => {
    //options設定
    const options: RequestInit = {
        method : "DELETE",
    }

    //作業分類削除
    const response = await fetchAPI(`/api/v1/category/${categoryNo}/`, options)
    if(!response.success){
        console.error("削除失敗:", response.error)
        return { success : false }
    }

    return { success: true }
}

//作業分類変更
export const putCategory = async (updateCategory: CategoryType) => {
    //options設定
    const options: RequestInit = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateCategory)
    }

    //作業分類変更
    const response = await fetchAPI(`/api/v1/category/${updateCategory.categoryNo}/`, options)

    if(!response.success){
        console.error("更新失敗", response.error)
        return { success:false }
    }

    return { success: true }
}