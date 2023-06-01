import { Request } from "express"

export type Task = {
  id?: string | number
  title: string
  isCompleted?: boolean
  updatedAt?: Date | null
  createdAt?: Date
}

export interface TaskRequest extends Request {
  body: Pick<Task, "title" | "isCompleted">
}
