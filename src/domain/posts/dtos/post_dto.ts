import zod from "zod";
const postSchemaObj = zod.object({
    id: zod.number().min(1).optional(),
    title: zod.string(),
    content: zod.string(),
    published: zod.boolean(),
    authorId: zod.number()
})

/**
 * @description describes the posts structure
 */
export type IPost = zod.infer<typeof postSchemaObj>;