"use server"

import { fetchAPI } from "./common"

// Processの型、項目定義
export interface ProcessType {
    processNo: number
    processName: string
}

// 工程一覧取得
export const getProcessList = async () => {
    // options設定
    const options: RequestInit = {
        method : "GET",
        cache: "no-store",
    }

    // 工程一覧取得
    const response = await fetchAPI("/api/v1/process/", options)
    if (!response.success) {
        console.error(response.error)
        return { success:false, processes:[]}
    }

    const processes: ProcessType[] = response.data
    return { success: true, processes}
}

// 工程追加
export const postProcess = async (newProcess: ProcessType) => {
    // options設定
    const options: RequestInit = {
        method : "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body : JSON.stringify(newProcess),
    }

    // 工程追加
    const response = await fetchAPI("/api/v1/process/", options)
    if(!response.success){
        console.error("登録失敗:", response.error)
        return { success:false }
    }

    return { success: true, data: response.data }
}

//工程削除
export const deleteProcess = async (processNo: number) => {
    //options設定
    const options: RequestInit = {
        method : "DELETE"
    }

    //工程削除
    const response = await fetchAPI(`/api/v1/process/${processNo}/`, options)
    if(!response.success){
        console.error("削除失敗:", response.error)
        return {success:false}
    }

    return { success: true}
}

//工程変更
export const putProcess = async (updateProcess: ProcessType) => {
    //options設定
    const options: RequestInit = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateProcess),
    }

    //工程変更
    const response = await fetchAPI(`/api/v1/process/${updateProcess.processNo}/`, options)

    if(!response.success){
        console.error("更新失敗", response.error)
        return {success:false}
    }

    return { success: true, data: response.data }
}