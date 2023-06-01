import fs from "fs"
import { dirname } from "path"
import sqlite3 from "sqlite3"
import { Task } from "../types"

const location: string = process.env.SQLITE_DB_LOCATION || "./todo.db"

let db: sqlite3.Database, dbAll: Function, dbRun: Function

function init(): Promise<void> {
  const dirName: string = dirname(location)
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true })
  }

  return new Promise<void>((acc, rej) => {
    db = new sqlite3.Database(location, (err: Error | null) => {
      if (err) return rej(err)

      if (process.env.NODE_ENV !== "test")
        console.log(`Using sqlite database at ${location}`)

      db.run(
        "CREATE TABLE IF NOT EXISTS tasks (id varchar(36), title varchar(255), isCompleted boolean)",
        (err: Error | null) => {
          if (err) return rej(err)
          acc()
        }
      )
    })
  })
}

async function teardown(): Promise<void> {
  return new Promise<void>((acc, rej) => {
    db.close((err: Error | null) => {
      if (err) rej(err)
      else acc()
    })
  })
}

async function getTasks(): Promise<object[]> {
  return new Promise<object[]>((acc, rej) => {
    db.all("SELECT * FROM tasks", (err: Error | null, rows: object[]) => {
      if (err) return rej(err)
      acc(
        rows.map((task: any) =>
          Object.assign({}, task, {
            isCompleted: task.isCompleted === 1,
          })
        )
      )
    })
  })
}

async function getTask(id: string): Promise<object | undefined> {
  return new Promise<object | undefined>((acc, rej) => {
    db.all(
      "SELECT * FROM tasks WHERE id=?",
      [id],
      (err: Error | null, rows: object[]) => {
        if (err) return rej(err)
        acc(
          rows
            .map((item: any) =>
              Object.assign({}, item, {
                isCompleted: item.isCompleted === 1,
              })
            )
            .shift()
        )
      }
    )
  })
}

async function storeTask(task: Task): Promise<void> {
  return new Promise<void>((acc, rej) => {
    db.run(
      "INSERT INTO tasks (id, title, isCompleted) VALUES (?, ?, ?)",
      [task.id, task.title, task.isCompleted ? 1 : 0],
      (err: Error | null) => {
        if (err) return rej(err)
        acc()
      }
    )
  })
}

async function updateTask(id: string, task: Task): Promise<void> {
  return new Promise<void>((acc, rej) => {
    db.run(
      "UPDATE tasks SET title=?, isCompleted=? WHERE id = ?",
      [task.title, task.isCompleted ? 1 : 0, id],
      (err: Error | null) => {
        if (err) return rej(err)
        acc()
      }
    )
  })
}

async function removeTask(id: string): Promise<void> {
  return new Promise<void>((acc, rej) => {
    db.run("DELETE FROM tasks WHERE id = ?", [id], (err: Error | null) => {
      if (err) return rej(err)
      acc()
    })
  })
}

export { init, teardown, getTasks, getTask, storeTask, updateTask, removeTask }
