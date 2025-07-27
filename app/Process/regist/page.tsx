"use client"

import { postProcess, ProcessType, putProcess } from '@/actions/process'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useState } from 'react'
import React from 'react'
import { toast } from 'sonner'

const registProcessHome = () => {

    const [newProcess, setNewProcess] = useState<ProcessType>({
        processNo : 0,
        processName:"",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewProcess((prev) => ({ ...prev, [name]: value }))
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
            } else {
                toast.error("工程マスタの登録に失敗しました")
            }

        }catch(error){
            toast.error(error instanceof Error ? error.message : "工程マスタの登録に失敗しました")
        }
    }

    return (
        <div className='space-y-6'>
            <div className='bg-card p-6 rounded-lg shadow-sm border'>
                <h2 className='text-xl font-semibold mb-4'>工程マスタ登録</h2>
                <label htmlFor="processNo" className='block text-sm font-medium mb-1'>工程番号</label>
                <Input  id='processNo' 
                        name='processNo'
                        value={newProcess.processNo}
                        onChange={handleInputChange}
                        placeholder='processNo' />
                <label htmlFor="processNo" className='block text-sm font-medium mb-1'>工程名</label>
                <Input  id='processName' 
                        name='processName'
                        value={newProcess.processName}
                        onChange={handleInputChange}
                        placeholder='processName' />
            </div>
            <Button onClick={handleAddProcess}>
                登録
            </Button>
            <Button asChild>
                <Link href="/Process">戻る</Link>
            </Button>
       </div>

    )
}

export default registProcessHome
