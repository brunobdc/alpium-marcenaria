import { beforeAll, describe, expect, jest, test } from "@jest/globals";
import { ResourceController } from "../../controller/resource_controller";
import { faker } from "@faker-js/faker";
import { Resource } from "../../domain/resource";
import { mockResourceEntity } from "../domain/resource_mock";

describe("ResourceController", () => {
    describe("CreateResource", () => {
        const mockParams = (params?: Partial<ResourceController.CreateResourceRequestDto>): ResourceController.CreateResourceRequestDto => {
            return {
                name: faker.word.sample(),
                uom: faker.word.sample({ length: 10 }),
                price: faker.commerce.price() as any,
                ...params
            }
        }

        test.each([
            { e: "name is null", params: mockParams({ name: null as any }) },
            { e: "name length is less than 5", params: mockParams({ name: faker.string.alphanumeric(4) }) },
            { e: "name length is greater than 80", params: mockParams({ name: faker.string.alphanumeric({ length: { min: 81, max: 100 } }) }) },
            { e: "name is not a string", params: mockParams({ name: faker.number.int() as any }) },
            { e: "uom is null", params: mockParams({ uom: null as any }) },
            { e: "uom is not a string", params: mockParams({ uom: faker.number.int() as any }) },
            { e: "uom is a empty string", params: mockParams({ uom: "" }) },
            { e: "uom length is greater than 10", params: mockParams({ uom: faker.string.alphanumeric({ length: { min: 11, max: 100 } }) }) },
            { e: "price is not a number", params: mockParams({ price: faker.word.sample() as any }) },
            { e: "price is empty", params: mockParams({ price: "" as any }) },
            { e: "price is 0", params: mockParams({ price: "0" as any }) },
            { e: "price is less than 0", params: mockParams({ price: "-1" as any }) }
        ])("should return 400 error if $e", async ({ params }) => {
            jest.spyOn(Resource, "createAndSave").mockResolvedValue(mockResourceEntity())

            const result = await ResourceController.CreateResource(params)

            expect(result.status).toEqual(400)
            expect((result.data as any).error ?? null).not.toBeNull()
        })

        test("should call Resource.createAndSave once with correct params and return 200 with id number", async () => {
            const resource = mockResourceEntity()
            const mockResourceFn = jest.spyOn(Resource, "createAndSave").mockResolvedValueOnce(resource)
            const params = mockParams()

            const result = await ResourceController.CreateResource(params)

            expect(mockResourceFn).toBeCalledWith({ ...params, price: parseFloat(params.price as any) })
            expect(result).toEqual({
                status: 200,
                data: {
                    id: resource.getId()
                }
            })
        })
    })
})