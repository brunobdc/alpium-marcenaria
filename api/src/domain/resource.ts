import { ResourceQueries } from "../db/queries/resource_queries"


export namespace Resource {
    export interface CreateEntityParams {
        name: string
        uom: string
        price: number
    }

    export class Entity {
        private id: number
        private name: string
        private uom: string
        private price: number

        constructor(params: CreateEntityParams & { id: number }) {
            this.id = params.id
            this.name = params.name
            this.uom = params.uom
            this.price = params.price
        }

        getId(): number {
            return this.id
        }
        getName(): string {
            return this.name
        }
        getUom(): string {
            return this.uom
        }
        getPrice(): number {
            return this.price
        }
    }

    export async function createAndSave(params: CreateEntityParams): Promise<Entity> {
        const id = await ResourceQueries.save(params)
        return new Entity({
            id,
            ...params
        })
    }
}