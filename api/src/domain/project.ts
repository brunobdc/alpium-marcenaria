export namespace Project {
    export interface CreateEntityParams {
        name: string
        resources: Array<{
            id: number
            quantity: number
        }>
    }
}