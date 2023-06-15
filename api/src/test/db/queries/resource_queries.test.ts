import { afterAll, afterEach, describe, expect, it, jest, test } from "@jest/globals"
import { ResourceQueries } from "../../../db/queries/resource_queries"
import { Pool } from "pg"
import { Resource } from "../../../domain/resource"
import { faker } from "@faker-js/faker"
import { Database } from "../../../db/db"

describe("ResourceQueries", () => {
    const pool = new Pool({ host: "172.17.0.2", port: 5432, password: "test", user: "postgres" })
    jest.spyOn(Database, "getPool").mockImplementation(() => pool)

    afterEach(async () => {
        await pool.query("DELETE FROM resources")
    })

    afterAll(async () => {
        await pool.end()
    })

    describe("save", () => {
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

    describe("existsName", () => {
        it("should return true if finds a resource with the same name", async () => {
            const params: Resource.CreateEntityParams = {
                name: faker.string.alphanumeric(20),
                uom: faker.word.sample({ length: 10 }),
                price: Number(faker.commerce.price())
            }

            await ResourceQueries.save(params)

            const result = await ResourceQueries.existsName(params.name)
            expect(result).toBeTruthy()
        })

        it("should return false if not finds a resource with the same name", async () => {
            const result = await ResourceQueries.existsName(faker.string.alphanumeric(20))
            expect(result).toBeFalsy()
        })
    })

    describe("searchByName", () => {
        it("should return empty if not finds any name like the passed one", async () => {
            const params: Resource.CreateEntityParams = {
                name: faker.string.alphanumeric(20),
                uom: faker.word.sample({ length: 10 }),
                price: Number(faker.commerce.price())
            }
            await ResourceQueries.save(params)

            const result = await ResourceQueries.searchByName(faker.word.sample())
            expect(result).toEqual([])
        })

        it("should return all the names that is like the passed one", async () => {
            const nameLike = faker.string.alphanumeric(5)
            const resources = [
                {
                    name: faker.string.alphanumeric(5) + nameLike,
                    uom: faker.word.sample({ length: 10 }),
                    price: Number(faker.commerce.price())
                },
                {
                    name: nameLike + faker.string.alphanumeric(5),
                    uom: faker.word.sample({ length: 10 }),
                    price: Number(faker.commerce.price())
                },
                {
                    name: faker.string.alphanumeric(5) + nameLike + faker.string.alphanumeric(5),
                    uom: faker.word.sample({ length: 10 }),
                    price: Number(faker.commerce.price())
                }
            ]

            for (const r of resources) {
                await ResourceQueries.save(r)
            }

            const result = await ResourceQueries.searchByName(nameLike)
            expect(result.length).toEqual(resources.length)
        })
    })

    describe("getAll", () => {
        it("should return all the inserted data", async () => {
            let count = 0
            for (let i = 0; i < faker.number.int(10); i++) {
                await ResourceQueries.save({
                    name: faker.string.alphanumeric(20),
                    uom: faker.word.sample({ length: 10 }),
                    price: Number(faker.commerce.price())
                })
                count++
            }

            const result = await ResourceQueries.getAll()
            expect(result.length).toEqual(count)
        })
    })
})