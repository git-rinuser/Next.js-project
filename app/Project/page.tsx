"use client"

import { DeleteProject, getProjectList, PostProject, ProjectType, PutProject } from "@/actions/project"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"


export default function ProjectPage() {
    const [projects, setProjects]= useState<ProjectType[]>([])

    const [editProject, setEditProject] = useState<ProjectType | null>(null)

    const [isRegistering, setIsRegistering] = useState(false)
    
    const [newProject, setNewProject] = useState<ProjectType>({
        projectNo : "",
        projectName : "",
        customer : "",
        planTime : "",
        resultTime : 0,
    })

    const handleChangeProjectName = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(editProject){
            setEditProject({...editProject, projectName : e.target.value})
        }
    }

    const handleChangePlanTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(editProject){
            const value = Number(e.target.value)
            setEditProject({...editProject, planTime : value})
        }
    }

    const handleInputChangeProject = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewProject((prev) => ({...prev, [name]: value}))
    }

    const getProjects = async() => {
        const { success, projects } = await getProjectList()

        if (success) {
            setProjects(projects)
            toast.success("プロジェクト一覧の取得に成功しました")
            console.log("プロジェクト：", projects)
        } else {
            toast.error("プロジェクト一覧の取得に失敗しました")
        }
    }

    const handleDeleteProject = async(projectNo : string) => {
        try{
            const res = await DeleteProject(projectNo)

            if(res.success){
                toast.success("プロジェクトマスタの削除に成功しました")
                getProjects()
            }else{
                toast.error("プロジェクトマスタの削除に失敗しました")
            }
        }catch(error){
            toast.error(error instanceof Error ? error.message : "プロジェクトマスタの削除に失敗しました")
        }
    }

    const handleEditProject = async(project: ProjectType) => {
        setEditProject(project)
    }

    const handleAddProject = async() => {
        if(!newProject.projectNo || !newProject.projectName){
            toast.error("プロジェクト番号とプロジェクト名を入力してください")
            return
        }

        try{
            const res = await PostProject(newProject)
            if(res.success){
                toast.success("プロジェクトマスタの登録に成功しました")
                setNewProject({projectNo:"", projectName:"", customer:0, planTime:0, resultTime:0})
                setIsRegistering(false)
                getProjects()
            }else{
                toast.error("プロジェクトマスタの登録に失敗しました")
                return
            }
        }catch(error){
            toast.error(error instanceof Error ? error.message : "プロジェクトマスタの登録に失敗しました")
            return
        }
    }

    const handleUpdateProject = async() => {
        if(!editProject?.projectNo || !editProject?.projectName){
            toast.error("プロジェクト番号が空です")
            return
        }

        try{
            const res = await PutProject(editProject)
            if(res.success){
                toast.success("更新に成功しました")
                setEditProject(null)
                getProjects()
            }else{
                toast.error("更新に失敗しました")
            }
        }catch(error){
            toast.error(error instanceof Error ? error.message : "プロジェクトマスタの更新に失敗しました")
        }
    }

    useEffect(() => {
        getProjects()
    }, [])

    return (
    <div className="container mx-auto">
      <h2>プロジェクト一覧</h2>

      <Table className='rounded-md border'>
        <TableHeader>
            <TableRow>
                <TableHead>プロジェクト番号</TableHead>
                <TableHead>プロジェクト名</TableHead>
                <TableHead>顧客番号</TableHead>
                <TableHead>予定工数</TableHead>
                <TableHead>実績工数</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
        {projects.map((project) => (
            <TableRow key={project.projectNo}>
                <TableCell>{project.projectNo}</TableCell>
                <TableCell>{project.projectName}</TableCell>
                <TableCell>{project.customer}</TableCell>
                <TableCell>{project.planTime}</TableCell>
                <TableCell>{project.resultTime}</TableCell>
                <TableCell><Button variant="destructive" onClick={() => handleDeleteProject(project.projectNo)}>削除</Button></TableCell>
                <TableCell><Button variant="outline" onClick={() => handleEditProject(project)}>編集</Button></TableCell>
            </TableRow>
        ))}
        </TableBody>
      </Table>

      {editProject && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-bold mb-2">プロジェクトを編集</h3>
          <p className='text-sm text-gray-600 mb-1'>プロジェクト番号：{editProject.projectNo}</p>
          <input
            className='border rounded px-2 py-1 w-full mb-2'
            value={editProject.projectName}
            onChange={handleChangeProjectName}
          />
          <input
            className='border rounded px-2 py-1 w-full mb-2'
            value={editProject.planTime}
            onChange={handleChangePlanTime}
          />
          <div className='flex gap-2'>
            <Button onClick={handleUpdateProject}>更新</Button>
            <Button variant="ghost" onClick={() => setEditProject(null)}>キャンセル</Button>
          </div>
        </div>
      )}

      <Button className='mt-6' onClick={() => setIsRegistering(true)}>
        プロジェクト番号追加
      </Button>

      <Button asChild className='mt-6'>
        <Link href="/">戻る</Link>
      </Button>

      {isRegistering && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-bold mb-2">新規プロジェクト登録</h3>
          <Input
            id="projectNo"
            name="projectNo"
            className="border rounded px-2 py-1 w-full mb-2"
            placeholder="プロジェクト番号"
            value={newProject.projectNo}
            onChange={handleInputChangeProject}
          />
          <Input
            id="projectName"
            name="projectName"
            className="border rounded px-2 py-1 w-full mb-2"
            placeholder="プロジェクト名"
            value={newProject.projectName}
            onChange={handleInputChangeProject}
          />
          <Input
            id="customer"
            name="customer"
            type="number"
            className="border rounded px-2 py-1 w-full mb-2"
            placeholder="顧客番号"
            value={newProject.customer}
            onChange={handleInputChangeProject}
          />
          <Input
            id="planTime"
            name="planTime"
            type="number"
            className="border rounded px-2 py-1 w-full mb-2"
            placeholder="予定工数"
            value={newProject.planTime}
            onChange={handleInputChangeProject}
          />
          <div className="flex gap-2">
            <Button onClick={handleAddProject}>登録</Button>
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