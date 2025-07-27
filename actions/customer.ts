"use server"

import { fetchAPI } from "./common"

//Customerの型　項目定義
export interface CustomerType {
    customerNo: number
    customerName: string
}

//顧客取得
export const getCutomerList = async() => {
    //options設定
    const options: RequestInit = {
        method : "GET",
        cache : "no-store"
    }

    //顧客一覧取得
    const response = await fetchAPI("/api/v1/customer/", options)
    if(!response.success){
        console.error(response.error)
        return { success:false, customers:[] }
    }

    const customers: CustomerType[] = response.data
    return { success:true, customers}
}

//顧客追加
export const PostCustomer = async (newCustomer: CustomerType) => {
    //options設定
    const options: RequestInit = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(newCustomer)
    }

    //顧客追加
    const response = await fetchAPI("/api/v1/customer/", options)
    if(!response.success){
        console.error("登録失敗", response.error)
        return { success : false }
    }

    return { success : true, data : response.data}
}

//顧客削除
export const DeleteCustomer = async (customerNo : number) => {
    //options設定
    const options : RequestInit = {
        method : "DELETE",
    }

    //顧客削除
    const response = await fetchAPI(`/api/v1/customer/${customerNo}/`, options)
    if(!response.success){
        console.error("削除失敗:", response.error)
        return { success : false}
    }

    return { success : true }
}

//顧客変更
export const PutCustomer = async (updateCutomer : CustomerType) => {
    //options設定
    const options : RequestInit = {
        method : "PUT",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(updateCutomer)
    }

    //顧客変更
    const response = await fetchAPI(`/api/v1/customer/${updateCutomer.customerNo}/`, options)

    if(!response.success){
        console.error("更新失敗", response.error)
        return { success : false } 
    }

    return { success : true }
}