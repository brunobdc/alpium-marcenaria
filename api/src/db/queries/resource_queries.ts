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
}