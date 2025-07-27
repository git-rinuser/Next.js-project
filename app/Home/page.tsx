"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Users, FolderOpen, Plus } from "lucide-react"

interface Customer {
  customerNo: number
  customerName: string
}

interface Category {
  categoryNo: number
  categoryName: string
}

interface Project {
  projectNo: string
  projectName: string
  customerNo: number
  customerName?: string
  planTime: number
  resultTime: number
}

interface Process {
  processNo: number
  processName: string
}

interface WorkRecord {
  id: number
  userNo: number
  userName?: string
  workDay: string
  projectNo: string
  projectName?: string
  customerNo: number
  customerName?: string
  categoryNo: number
  categoryName?: string
  processNo: number
  processName?: string
  planTime: number
  resultTime: number
}

export default function WorkRecordApp() {
  const [workRecords, setWorkRecords] = useState<WorkRecord[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [processes, setProcesses] = useState<Process[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRecord, setNewRecord] = useState({
    workDay: new Date().toISOString().split("T")[0],
    projectNo: "",
    categoryNo: "",
    processNo: "",
    planTime: "",
    resultTime: "",
  })

  // Mock data for demonstration
  useEffect(() => {
    const mockCustomers: Customer[] = [
      { customerNo: 1, customerName: "株式会社A" },
      { customerNo: 2, customerName: "株式会社B" },
      { customerNo: 3, customerName: "株式会社C" },
    ]

    const mockCategories: Category[] = [
      { categoryNo: 1, categoryName: "開発" },
      { categoryNo: 2, categoryName: "設計" },
      { categoryNo: 3, categoryName: "テスト" },
      { categoryNo: 4, categoryName: "会議" },
    ]

    const mockProjects: Project[] = [
      { projectNo: "PRJ001", projectName: "Webシステム開発", customerNo: 1, planTime: 160, resultTime: 120 },
      { projectNo: "PRJ002", projectName: "モバイルアプリ開発", customerNo: 2, planTime: 200, resultTime: 180 },
      { projectNo: "PRJ003", projectName: "システム保守", customerNo: 1, planTime: 80, resultTime: 75 },
    ]

    const mockProcesses: Process[] = [
      { processNo: 1, processName: "要件定義" },
      { processNo: 2, processName: "基本設計" },
      { processNo: 3, processName: "詳細設計" },
      { processNo: 4, processName: "実装" },
      { processNo: 5, processName: "単体テスト" },
      { processNo: 6, processName: "結合テスト" },
      { processNo: 7, processName: "システムテスト" },
    ]

    const mockWorkRecords: WorkRecord[] = [
      {
        id: 1,
        userNo: 1,
        userName: "田中太郎",
        workDay: "2024-01-15",
        projectNo: "PRJ001",
        projectName: "Webシステム開発",
        customerNo: 1,
        customerName: "株式会社A",
        categoryNo: 1,
        categoryName: "開発",
        processNo: 4,
        processName: "実装",
        planTime: 8,
        resultTime: 7,
      },
      {
        id: 2,
        userNo: 1,
        userName: "田中太郎",
        workDay: "2024-01-16",
        projectNo: "PRJ002",
        projectName: "モバイルアプリ開発",
        customerNo: 2,
        customerName: "株式会社B",
        categoryNo: 2,
        categoryName: "設計",
        processNo: 2,
        processName: "基本設計",
        planTime: 6,
        resultTime: 8,
      },
    ]

    setCustomers(mockCustomers)
    setCategories(mockCategories)
    setProjects(mockProjects)
    setProcesses(mockProcesses)
    setWorkRecords(mockWorkRecords)
  }, [])

  const handleAddRecord = () => {
    if (
      !newRecord.projectNo ||
      !newRecord.categoryNo ||
      !newRecord.processNo ||
      !newRecord.planTime ||
      !newRecord.resultTime
    ) {
      alert("すべての項目を入力してください")
      return
    }

    const selectedProject = projects.find((p) => p.projectNo === newRecord.projectNo)
    const selectedCategory = categories.find((c) => c.categoryNo === Number.parseInt(newRecord.categoryNo))
    const selectedProcess = processes.find((p) => p.processNo === Number.parseInt(newRecord.processNo))
    const selectedCustomer = customers.find((c) => c.customerNo === selectedProject?.customerNo)

    const record: WorkRecord = {
      id: workRecords.length + 1,
      userNo: 1,
      userName: "田中太郎",
      workDay: newRecord.workDay,
      projectNo: newRecord.projectNo,
      projectName: selectedProject?.projectName,
      customerNo: selectedProject?.customerNo || 0,
      customerName: selectedCustomer?.customerName,
      categoryNo: Number.parseInt(newRecord.categoryNo),
      categoryName: selectedCategory?.categoryName,
      processNo: Number.parseInt(newRecord.processNo),
      processName: selectedProcess?.processName,
      planTime: Number.parseInt(newRecord.planTime),
      resultTime: Number.parseInt(newRecord.resultTime),
    }

    setWorkRecords([...workRecords, record])
    setNewRecord({
      workDay: new Date().toISOString().split("T")[0],
      projectNo: "",
      categoryNo: "",
      processNo: "",
      planTime: "",
      resultTime: "",
    })
    setShowAddForm(false)
  }

  const totalPlanTime = workRecords.reduce((sum, record) => sum + record.planTime, 0)
  const totalResultTime = workRecords.reduce((sum, record) => sum + record.resultTime, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">作業実績管理システム</h1>
          <p className="text-gray-600">プロジェクトの作業時間を記録・管理します</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総予定時間</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPlanTime}h</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総実績時間</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResultTime}h</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">顧客数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">プロジェクト数</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Work Records Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>作業実績一覧</CardTitle>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-2" />
                新規登録
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showAddForm && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">新規作業実績登録</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="workDay">作業日</Label>
                    <Input
                      id="workDay"
                      type="date"
                      value={newRecord.workDay}
                      onChange={(e) => setNewRecord({ ...newRecord, workDay: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="project">プロジェクト</Label>
                    <Select
                      value={newRecord.projectNo}
                      onValueChange={(value) => setNewRecord({ ...newRecord, projectNo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="プロジェクトを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.projectNo} value={project.projectNo}>
                            {project.projectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">カテゴリ</Label>
                    <Select
                      value={newRecord.categoryNo}
                      onValueChange={(value) => setNewRecord({ ...newRecord, categoryNo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.categoryNo} value={category.categoryNo.toString()}>
                            {category.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="process">プロセス</Label>
                    <Select
                      value={newRecord.processNo}
                      onValueChange={(value) => setNewRecord({ ...newRecord, processNo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="プロセスを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {processes.map((process) => (
                          <SelectItem key={process.processNo} value={process.processNo.toString()}>
                            {process.processName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="planTime">予定時間</Label>
                    <Input
                      id="planTime"
                      type="number"
                      placeholder="時間"
                      value={newRecord.planTime}
                      onChange={(e) => setNewRecord({ ...newRecord, planTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="resultTime">実績時間</Label>
                    <Input
                      id="resultTime"
                      type="number"
                      placeholder="時間"
                      value={newRecord.resultTime}
                      onChange={(e) => setNewRecord({ ...newRecord, resultTime: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button onClick={handleAddRecord}>登録</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      キャンセル
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>作業日</TableHead>
                  <TableHead>担当者</TableHead>
                  <TableHead>顧客</TableHead>
                  <TableHead>プロジェクト</TableHead>
                  <TableHead>カテゴリ</TableHead>
                  <TableHead>プロセス</TableHead>
                  <TableHead>予定時間</TableHead>
                  <TableHead>実績時間</TableHead>
                  <TableHead>差異</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workRecords.map((record) => {
                  const difference = record.resultTime - record.planTime
                  return (
                    <TableRow key={record.id}>
                      <TableCell>{record.workDay}</TableCell>
                      <TableCell>{record.userName}</TableCell>
                      <TableCell>{record.customerName}</TableCell>
                      <TableCell>{record.projectName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{record.categoryName}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.processName}</Badge>
                      </TableCell>
                      <TableCell>{record.planTime}h</TableCell>
                      <TableCell>{record.resultTime}h</TableCell>
                      <TableCell>
                        <Badge variant={difference > 0 ? "destructive" : difference < 0 ? "default" : "secondary"}>
                          {difference > 0 ? `+${difference}h` : difference < 0 ? `${difference}h` : "±0h"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}