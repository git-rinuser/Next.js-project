"use server"

import { revalidatePath } from "next/cache"
import { fetchAPI } from "./common"

export interface UserType {
    userNo: string
    userName: string
    email: string
    password: string
    sortNo: number
    is_superuser: boolean
    is_active: boolean
    is_staff: boolean
}

//ユーザー一覧取得
export const getUserList = async() => {
    //options設定
    console.log("getUserList処理実行")
    const options: RequestInit = {
        method : "GET",
        headers : {
            "Content-Type" : "application/json", 
        },
        cache : "no-store",
    }

    //ユーザー一覧取得
    const response = await fetchAPI("/api/v1/user/", options)
    if (!response.success){
        console.error(response.error)
        return {success:false, users:[]}
    }

    const users: UserType[] = response.data
    return { success: true, users}
}

//ユーザー取得
export const getUserById = async(userNo: number) => {
    //options設定
    const options: RequestInit = {
        method : "GET",
        headers : {
            "Content-Type" : "application/json", 
        },
        cache : "no-store",
    }

    //ユーザー一覧取得
    const response = await fetchAPI(`/api/v1/user/${userNo}`, options)
    if (!response.success){
        console.error(response.error)
        return {success: false, user: null}
    }

    const user: UserType = response.data
    return { success: true, user}
}

//ユーザー登録
export const registUser = async (newUser: UserType)=> {
    //options設定
    const options: RequestInit = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json", 
        },
        body : JSON.stringify(newUser)
    }

    const response = await fetchAPI("/api/v1/user/", options)
    if(!response.success){
        console.error(response.error)
        console.error(response.data)
        return { success:false, users:[], data: response.data}
    }

    const users: UserType[] = response.data
    return { success: true, users}
}

//ユーザー変更
export const updateUser = async (userNo: string, userdata: UserType) => {
    //options設定
    const options: RequestInit = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userdata)
    }

    const targetUserNo = userdata.userNo !== userNo ? userdata.userNo : userNo

    const response = await fetchAPI(`/api/v1/user/${userNo}/`, options)
    if(!response.success){
        console.error("更新失敗", response.error)
        return {success: false, error: "入力内容に問題があります", fieldErrors: response.data}
    }

    //キャッシュを更新
    revalidatePath("/User")
    revalidatePath(`/User/${userNo}`)
    if(targetUserNo !== userNo){
        revalidatePath(`/User/${targetUserNo}`)
    }

    return { success: true, data: response.data } 
}

//ユーザー削除
export const deleteUser = async (userNo: string) => {
    //options設定
    const options: RequestInit = {
        method: "DELETE"
    }

    //ユーザー削除
    const response = await fetchAPI(`/api/v1/user/${userNo}/`, options)
    if(!response.success){
        console.error("削除失敗:", response.error)
        return {success:false}
    }

    return {success: true}
}