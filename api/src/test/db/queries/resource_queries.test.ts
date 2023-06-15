import { afterAll, describe, expect, it, jest, test } from "@jest/globals"
import { ResourceQueries } from "../../../db/queries/resource_queries"
import { Pool } from "pg"
import { Resource } from "../../../domain/resource"
import { faker } from "@faker-js/faker"
import { Database } from "../../../db/db"

describe("ResourceQueries", () => {
    const pool = new Pool({ host: "172.17.0.2", port: 5432, password: "test", user: "postgres" })
    jest.spyOn(Database, "getPool").mockImplementation(() => pool)

    afterAll(async () => {
        await pool.query("DELETE FROM resources")
        await pool.end()
    })

    it("should insert the correct data and return the id", async () => {
        const params: Resource.CreateEntityParams = {
            name: faker.word.sample(),
            uom: faker.word.sample({ length: 10 }),
            price: Number(faker.commerce.price())
        }

        const id = await ResourceQueries.save(params)

        expect(id).not.toBeUndefined()

        const result = await pool.query("SELECT id, name, uom, price::numeric FROM resources WHERE id = $1", [id])
        expect(result.rows[0].id).toEqual(id)
        expect(result.rows[0].name).toEqual(params.name)
        expect(result.rows[0].uom).toEqual(params.uom)
        expect(Number(result.rows[0].price)).toEqual(params.price)
    })
})