import * as dotenv from "dotenv"
dotenv.config()

const config = {
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "root",
  DB_NAME: process.env.DB_NAME || "mydb",
  DB_PORT: process.env.DB_PORT || "5432",
  DB_URL: process.env.DB_URL || "",
}

export default config
