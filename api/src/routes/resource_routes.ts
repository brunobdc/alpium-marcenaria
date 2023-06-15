import { Router } from "express";
import { ResourceController } from "../controller/resource_controller";

const router = Router()

router.post("/", async function (req, res) {
    const result = await ResourceController.CreateResource(req.body)
    res.setHeader("ContentType", "application/json")
    res.status(result.status).send(result.data)
})

export default router