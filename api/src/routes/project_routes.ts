import { Router } from "express";
import { ProjectController } from "../controller/project_controller";
import { ProjectQueries } from "../db/queries/project_queries";

const router = Router()

router.post("/", async function (req, res) {
    const result = await ProjectController.CreateProject(req.body)
    res.setHeader("ContentType", "application/json")
    res.status(result.status).send(result.data)
})

router.get("/", async function (req, res) {
    const result = await ProjectQueries.getAll()
    res.setHeader("ContentType", "application/json")
    res.status(200).send(result)
})

export default router