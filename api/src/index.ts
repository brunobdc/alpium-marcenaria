import bodyParser from "body-parser"
import express from "express"
import ResourceRouter from "./routes/resource_routes"

const app = express()
const port = 8000

app.use(bodyParser.json())

app.use("/resource", ResourceRouter)
app.listen(port, () => {
    console.log(`API listening on port ${port}`)
})