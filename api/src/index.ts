import bodyParser from "body-parser"
import express from "express"
import ResourceRouter from "./routes/resource_routes"
import ReportRouter from "./routes/project_routes"
import { Database } from "./db/db"

Database.setup()
const app = express()
const port = 8000

app.use(bodyParser.json())
app.use("/resource", ResourceRouter)
app.use("/project", ReportRouter)
app.listen(port, () => {
    console.log(`API listening on port ${port}`)
})