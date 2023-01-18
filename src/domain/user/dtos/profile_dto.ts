import { IUser, userSchemaObj } from "./user_dto";
import zod from "zod"


const profileSchemaObj = zod.object({
    id: zod.number().min(1).optional(),
    bio: zod.string(),
    user: userSchemaObj,
    userId: zod.string(), 
})

export type IProfile = zod.infer<typeof profileSchemaObj>;