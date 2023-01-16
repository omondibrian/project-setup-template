import { IUser } from "./user_dto";

export interface IProfile{
    id?: number,
    bio: string,
    user: IUser,
    userId: number
}