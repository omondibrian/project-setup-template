import zod from "zod"


export const userSchemaObj = zod.object({
    id: zod.number().min(1).optional(),
    email: zod.string(),
    name: zod.string(), 
})

export type IUser = zod.infer<typeof userSchemaObj>;