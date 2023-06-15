import { faker } from "@faker-js/faker";
import { Resource } from "../../domain/resource";

export function mockResourceEntity(): Resource.Entity {
    return new Resource.Entity({
        id: faker.number.int(),
        name: faker.word.sample(),
        uom: faker.word.sample({ length: 10 }),
        price: Number(faker.commerce.price())
    })
}