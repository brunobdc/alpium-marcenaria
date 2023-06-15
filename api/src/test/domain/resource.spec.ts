import { describe, expect, it, jest } from "@jest/globals";
import { Resource } from "../../domain/resource";
import { ResourceQueries } from "../../db/queries/resource_queries";
import { faker } from "@faker-js/faker";

describe("Resource", () => {
    describe(Resource.createAndSave, () => {
        const mockParams = (params?: Partial<Resource.CreateEntityParams>): Resource.CreateEntityParams => {
            return {
                name: faker.word.sample(),
                uom: faker.word.sample({ length: 10 }),
                price: Number(faker.commerce.price()),
                ...params
            }
        }

        it("should call ResourceQueries.save once with correct params", async () => {
            const saveQueryFunc = jest.spyOn(ResourceQueries, "save").mockResolvedValueOnce(1)
            const params = mockParams()

            await Resource.createAndSave(params)

            expect(saveQueryFunc).toBeCalledTimes(1)
            expect(saveQueryFunc.mock.calls[0][0]).toEqual(params)
        })

        it("should return the entity with the correct data", async () => {
            const id = faker.number.int()
            jest.spyOn(ResourceQueries, "save").mockResolvedValueOnce(id)
            const params = mockParams()

            const entity = await Resource.createAndSave(params)

            expect(entity.getId()).toEqual(id)
            expect(entity.getName()).toEqual(params.name)
            expect(entity.getUom()).toEqual(params.uom)
            expect(entity.getPrice()).toEqual(params.price)
        })
    })
})