import { z } from "zod";
import { ProjectQueries } from "../db/queries/project_queries";
import { ResourceQueries } from "../db/queries/resource_queries";

export namespace ProjectController {

    const CreateProjectSchema = z.object({
        name: z.string().min(5).max(100),
        resources: z.array(z.object({
            id: z.string().min(1),
            quantity: z.string().min(1)
        }).superRefine((args, ctx) => {
            const maybeParsed = z.object({
                id: z.number().int().min(1),
                quantity: z.number().int().min(1)
            }).safeParse({ id: parseInt(args.id), quantity: parseInt(args.quantity) })
            if (!maybeParsed.success) {
                maybeParsed.error.issues.forEach(issue => ctx.addIssue(issue))
            }
            return z.NEVER
        }).transform(args => ({ id: parseInt(args.id), quantity: parseInt(args.quantity) })))
    })

    interface CreateProjectRequestDto extends z.infer<typeof CreateProjectSchema> { }

    interface CreateProjectResponse {
        status: 200,
        data: {
            id: number
        }
    }

    interface ErrorResponse {
        status: number,
        data: {
            error: string
        }
    }

    export async function CreateProject(body: CreateProjectRequestDto): Promise<CreateProjectResponse | ErrorResponse> {
        const maybeParsed = CreateProjectSchema.safeParse(body)
        if (!maybeParsed.success) {
            return {
                status: 400,
                data: {
                    error: maybeParsed.error.message
                }
            }
        }
        const data = maybeParsed.data

        if (await ProjectQueries.existsName(data.name)) {
            return {
                status: 403,
                data: {
                    error: "Nome de projeto ja em utilizacao!"
                }
            }
        }

        for (const resource of data.resources) {
            if (await ResourceQueries.exists(resource.id)) {
                return {
                    status: 403,
                    data: {
                        error: "Recurso nao encontrado!"
                    }
                }
            }
        }

        const projectId = await ProjectQueries.save(data)

        return {
            status: 200,
            data: {
                id: projectId
            }
        }
    }
}