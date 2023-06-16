import { Router } from "express";
import { ResourceController } from "../controller/resource_controller";
import { ResourceQueries } from "../db/queries/resource_queries";

const router = Router()

router.post("/", async (req, res) => {
    const result = await ResourceController.CreateResource(req.body)
    res.setHeader("ContentType", "application/json")
    res.status(result.status).send(result.data)
})

router.get("/by-name", async (req, res) => {
    const result = await ResourceController.SearchByName(req.query as any)
    res.setHeader("ContentType", "application/json")
    res.status(result.status).send(result.data)
})

router.get("/", async (req, res) => {
    const result = await ResourceQueries.getAll()
    res.setHeader("ContentType", "application/json")
    res.status(200).send(result)
})

export default router