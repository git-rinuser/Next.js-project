"use client"

import React, { useEffect, useState } from 'react'
import { deleteProcess, getProcessList, postProcess, ProcessType, putProcess } from '@/actions/process'
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

const ProcessHome = () => {

  const [processes, setProcesses] = useState<ProcessType[]>([])

  const [editProcess, setEditProcess] = useState<ProcessType | null>(null)

  const [isRegistering, setIsRegistering] = useState(false)

  const [newProcess, setNewProcess] = useState<ProcessType>({
    processNo : 0,
    processName : ""
  })

  const handleDeleteProcess = async(processNo: number) => {
    console.log("工程マスタを削除します")

    try{
        const res = await deleteProcess(processNo)

        if(res.success){
            toast.success("工程マスタの削除に成功しました")
            getProcesses()
        } else {
            toast.error("工程マスタの削除に失敗しました")
        }

    }catch(error){
        toast.error(error instanceof Error ? error.message : "工程マスタの削除に失敗しました")
    }
  }

  const getProcesses = async () => {
    const { success, processes } = await getProcessList()

    if (success) {
      setProcesses(processes)
    } else {
      toast.error("工程一覧の取得に失敗しました")
    }
  }
  
  const handleEditProcess = (process: ProcessType) => {
    setEditProcess(process)
  }

  const handleChangeProcessName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editProcess) {
      setEditProcess({ ...editProcess, processName: e.target.value })
    }
  }

  const handleInputChangeProcess = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProcess((prev) => ({ ...prev, [name]: value}))
  }

  const handleUpdateProcess = async () => {
    if(!editProcess?.processNo || !editProcess?.processName){
        toast.error("工程名が空です")
        return
    }

    try{
        const res = await putProcess(editProcess)
        if(res.success){
            toast.success("更新に成功しました")
            setEditProcess(null)
            getProcesses()
        }else{
          toast.error("更新に失敗しました")
          return
        }
    }catch(error){
      toast.error(error instanceof Error ? error.message : "工程マスタの更新に失敗しました")
    }
  }

  const handleAddProcess = async() => {
    console.log("工程マスタを登録します")
    if(!newProcess.processNo || !newProcess.processName){
      toast.error("工程番号と工程名を入力してください")
      return
    }
  
    try{
      const res = await postProcess(newProcess)
      if(res.success){
        toast.success("工程マスタの登録に成功しました")
        setNewProcess({processNo:0, processName:""})
        setIsRegistering(false)
        getProcesses()
      } else {
        toast.error("工程マスタの登録に失敗しました")
      }
  
    }catch(error){
      toast.error(error instanceof Error ? error.message : "工程マスタの登録に失敗しました")
    }
  }

  useEffect(() => {
    getProcesses()
  }, [])

  return (
    <div className='container mx-auto'>
      <h2>工程一覧</h2>

      <Table className='rounded-md border'>
        <TableBody>
        {processes.map((process) => (
          <TableRow key={process.processNo}>
            <TableCell>{process.processNo}</TableCell>
            <TableCell>{process.processName}</TableCell>
            <TableCell><Button variant="destructive" onClick={() => handleDeleteProcess(process.processNo)}>削除</Button></TableCell>
            <TableCell><Button variant="outline" onClick={() => handleEditProcess(process)}>編集</Button></TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>

      {editProcess && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-bold mb-2">工程を編集</h3>
          <p className='text-sm text-gray-600 mb-1'>工程番号：{editProcess.processNo}</p>
          <input
            className='border rounded px-2 py-1 w-full mb-2'
            value={editProcess.processName}
            onChange={handleChangeProcessName}
          />
          <div className='flex gap-2'>
            <Button onClick={handleUpdateProcess}>更新</Button>
            <Button variant="ghost" onClick={() => setEditProcess(null)}>キャンセル</Button>
          </div>
        </div>
      )}

      <Button className='mt-6' onClick={() => setIsRegistering(true)}>
        工程追加
      </Button>

      <Button asChild className='mt-6'>
        <Link href="/">戻る</Link>
      </Button>

      {isRegistering && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-bold mb-2">新規工程登録</h3>
          <Input
            id="processNo"
            name="processNo"
            className="border rounded px-2 py-1 w-full mb-2"
            placeholder="工程番号"
            value={newProcess.processNo}
            onChange={handleInputChangeProcess}
          />
          <Input
            id="processName"
            name="processName"
            className="border rounded px-2 py-1 w-full mb-2"
            placeholder="工程名"
            value={newProcess.processName}
            onChange={handleInputChangeProcess}
          />
          <div className="flex gap-2">
            <Button onClick={handleAddProcess}>登録</Button>
            <Button variant="ghost" onClick={() => setIsRegistering(false)}>
              キャンセル
            </Button>
          </div>
        </div>
      )}

     </div>
  )
  
}

export default ProcessHome
