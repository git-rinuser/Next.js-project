"use server"

import { fetchAPI } from "./common"

//Projectの型　項目定義
export interface ProjectType {
    projectNo : string
    projectName : string
    customer : number | ""
    planTime : number | ""
    resultTime : number
}

//プロジェクト取得
export const getProjectList = async() => {
    //options設定
    const options: RequestInit = {
        method : "GET",
        cache : "no-store"
    }

    //プロジェクト一覧取得
    const response = await fetchAPI("/api/v1/project/", options)
    if(!response.success){
        console.error(response.error)
        return { success:false, projects:[] }
    }

    const projects: ProjectType[] = response.data
    return { success:true, projects}
}

//プロジェクト追加
export const PostProject = async (newProject: ProjectType) => {
    //options設定
    const options: RequestInit = {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(newProject)
    }

    //プロジェクト追加
    const response = await fetchAPI("/api/v1/project/", options)
    if(!response.success){
        console.error("登録失敗", response.error)
        return { success : false }
    }

    return { success : true, data : response.data}
}

//プロジェクト削除
export const DeleteProject = async (projectNo : string) => {
    //options設定
    const options : RequestInit = {
        method : "DELETE",
    }

    //プロジェクト削除
    const response = await fetchAPI(`/api/v1/project/${projectNo}/`, options)
    if(!response.success){
        console.error("削除失敗:", response.error)
        return { success : false}
    }

    return { success : true }
}

//プロジェクト変更
export const PutProject = async (updateProject : ProjectType) => {
    //options設定
    const options : RequestInit = {
        method : "PUT",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(updateProject)
    }

    //プロジェクト変更
    const response = await fetchAPI(`/api/v1/project/${updateProject.projectNo}/`, options)

    if(!response.success){
        console.error("更新失敗", response.error)
        return { success : false } 
    }

    return { success : true }
}