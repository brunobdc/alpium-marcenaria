import { Project } from "../../domain/project";
import { Database } from "../db";

export namespace ProjectQueries {
    export async function save(params: Project.CreateEntityParams): Promise<number> {
        const inserteProject = await Database.getPool().query("INSERT INTO projects (name) VALUES ($1) RETURNING id", [params.name])
        const projectId = parseInt(inserteProject.rows[0].id)
        for (const resource of params.resources) {
            await Database
                .getPool()
                .query(
                    "INSERT INTO project_resources (projectId, resourceId, resourceQty) VALUES ($1, $2, $3)",
                    [projectId, resource.id, resource.quantity]
                )
        }

        return projectId
    }

    export async function existsName(name: string): Promise<boolean> {
        const result = await Database.getPool().query("SELECT 1 FROM projects WHERE name = $1", [name])

        return !!result.rowCount
    }

    export async function getAll(): Promise<Array<{ id: number, name: string, resources: Array<{ id: number, name: string, uom: string, price: number, quantity: number }> }>> {
        const result = await Database.getPool().query(
            `--sql
            SELECT  projects.id as id,
                    projects.name as name,
                    resources.id as resourceId,
                    resources.name as resourceName,
                    resources.uom as uom,
                    resources.price::numeric as price,
                    project_resources.quantity as quantity
            FROM projects
            INNER JOIN project_resources
                ON project_resources.projectsId = projects.id
            INNER JOIN resources
                ON resources.id = project_resources.resourceId
            `
        )

        return result.rows.reduce((previous, current) => {
            if (previous.length == 0 || previous[previous.length - 1].id !== parseInt(current.id)) {
                previous.push({
                    id: parseInt(current.id),
                    name: current.name,
                    resources: [{
                        id: parseInt(current.resourceId),
                        name: current.resourceName,
                        uom: current.uom,
                        price: parseFloat(current.price),
                        quantity: parseInt(current.quantity)
                    }]
                })
                return previous
            }
            previous[previous.length - 1].resources.push({
                id: parseInt(current.resourceId),
                name: current.resourceName,
                uom: current.uom,
                price: parseFloat(current.price),
                quantity: parseInt(current.quantity)
            })
            return previous
        }, [])
    }
}