/**
 * @description describes the posts structure
 */
export interface IPost{
    id?:number,
    title:string,
    content:string,
    published:boolean,
    authorId: number,
}