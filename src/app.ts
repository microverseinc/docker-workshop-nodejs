import express, { Application } from "express"
import { PORT } from "./constants"
import db from "./db"
import { taskRouter } from "./routes"
import shutdownServer from "./utils/shutdownServer"

const app: Application = express()

app.use(express.json())
app.use(express.static(__dirname + "/public"))

app.use("/tasks", taskRouter)

app.listen(PORT, async function runServer() {
  try {
    await db.init()
  } catch (error) {
    console.error("error with DB!", error)
  }

  console.log(`Todo list app is running on port ${PORT}`)
})

process.on("SIGINT", shutdownServer)
process.on("SIGTERM", shutdownServer)
process.on("SIGUSR2", shutdownServer) // Sent by nodemon
