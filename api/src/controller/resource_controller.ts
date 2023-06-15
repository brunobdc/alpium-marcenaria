import { z } from "zod";
import { Resource } from "../domain/resource";

export namespace ResourceController {
    const CreateResourceSchema = z.object({
        name: z.string().min(5).max(80),
        uom: z.string().min(1).max(10),
        price: z.string().min(1)
    }).superRefine((arg, ctx) => {
        const maybeParsed = z.object({
            price: z.number().min(0.01).positive()
        }).safeParse({ price: parseFloat(arg.price) })
        if (!maybeParsed.success) {
            maybeParsed.error.issues.forEach(issue => ctx.addIssue(issue))
        }
        return z.NEVER
    }).transform(arg => ({ ...arg, price: parseFloat(arg.price) }))

    interface CreateResourceResponse {
        status: number
        data: {
            id: number
        }
    }

    interface ErrorResponse {
        status: number
        data: {
            error: string
        }
    }

    export interface CreateResourceRequestDto extends z.infer<typeof CreateResourceSchema> { }

    export async function CreateResource(body: CreateResourceRequestDto): Promise<CreateResourceResponse | ErrorResponse> {
        const maybeParsed = CreateResourceSchema.safeParse(body)
        if (!maybeParsed.success) {
            return {
                status: 400,
                data: {
                    error: maybeParsed.error.message
                }
            }
        }

        const params = maybeParsed.data
        const resource = await Resource.createAndSave(params)

        return {
            status: 200,
            data: {
                id: resource.getId()
            }
        }
    }
}