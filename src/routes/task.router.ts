import { Router } from "express"
import {
  completeTask,
  createTask,
  deleteTask,
  getAllTasks,
} from "../controllers/task.controller"

const taskRouter = Router()

taskRouter.get("/", getAllTasks)

taskRouter.post("/", createTask)

taskRouter.patch("/:id", completeTask)

taskRouter.delete("/:id", deleteTask)

export default taskRouter
