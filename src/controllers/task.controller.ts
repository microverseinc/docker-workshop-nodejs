import { Response } from "express"
import { v4 } from "uuid"
import db from "../db"
import { Task, TaskRequest } from "../types"

let tasks: Task[] = [
  {
    id: 1,
    title: "First task",
    isCompleted: false,
    updatedAt: null,
    createdAt: new Date(),
  },
]

export async function getAllTasks(req: TaskRequest, res: Response) {
  const items = await db.getTasks()
  res.send(items)
}

export async function createTask(req: TaskRequest, res: Response) {
  const { title, isCompleted } = req.body
  const task = {
    id: v4(),
    title,
    isCompleted,
  }

  await db.storeTask(task)

  const allTasks = await db.getTasks()

  res.status(201).json(allTasks)
}

export async function completeTask(req: TaskRequest, res: Response) {
  const taskId = req.params.id

  await db.updateTask(taskId, req.body)

  const tasks = await db.getTasks()

  res.json(tasks)
}

export async function deleteTask(req: TaskRequest, res: Response) {
  const taskId = req.params.id

  await db.removeTask(taskId)

  const tasks = await db.getTasks()

  res.json(tasks)
}
