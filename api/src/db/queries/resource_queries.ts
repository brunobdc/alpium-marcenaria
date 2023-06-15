import { Resource } from "../../domain/resource";
import { Database } from "../db";

export namespace ResourceQueries {
    export async function save(resource: Resource.CreateEntityParams): Promise<number> {
        const result = await Database.getPool().query(
            "INSERT INTO resources (name, uom, price) VALUES($1, $2, $3) RETURNING id;",
            [resource.name, resource.uom, resource.price]
        )

        return result.rows[0].id
    }

    export async function existsName(name: string): Promise<boolean> {
        const result = await Database.getPool().query("SELECT 1 FROM resources WHERE name = $1", [name])
        return !!result.rowCount
    }

    export async function searchByName(name: string): Promise<Array<Resource.CreateEntityParams & { id: number }>> {
        const result = await Database.getPool().query(`SELECT id, name, uom, price::numeric FROM resources WHERE name LIKE '%${name}%'`)

        return result.rows.map(value => ({
            ...value,
            id: parseInt(value.id),
            price: parseFloat(value.price)
        }))
    }

    export async function getAll(): Promise<Array<Resource.CreateEntityParams & { id: number }>> {
        const result = await Database.getPool().query("SELECT id, name, uom, price::numeric FROM resources")

        return result.rows.map(value => ({
            ...value,
            id: parseInt(value.id),
            price: parseFloat(value.price)
        }))
    }
}