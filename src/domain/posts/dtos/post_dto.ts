import zod from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreatePostRequest:
 *      type: object
 *      required:
 *        - title
 *        - content
 *        - published
 *        - authorId
 *      properties:
 *        title:
 *          type: string
 *          default: test post
 *        content:
 *          type: string
 *          default: Consequatur soluta dolor omnis fugit beatae labore tempore sed. Ut quaerat id odit rerum est nostrum doloremque. Explicabo est sunt ut temporibus. Aliquam totam animi quia deserunt ipsa
 *        published:
 *          type: boolean
 *          default: false
 *        authorId:
 *          type: string
 *          default: 1
 *    PostResponse:
 *      type: object
 *      required:
 *        - title
 *        - content
 *        - published
 *        - authorId
 *        - id 
 *      properties:
 *        title:
 *          type: string
 *          default: test post
 *        content:
 *          type: string
 *          default: Consequatur soluta dolor omnis fugit beatae labore tempore sed. Ut quaerat id odit rerum est nostrum doloremque. Explicabo est sunt ut temporibus. Aliquam totam animi quia deserunt ipsa
 *        published:
 *          type: boolean
 *          default: false
 *        authorId:
 *          type: string
 *          default: "1"
 *        id:
 *          type: string
 *          default: "1"
 */
export const postSchemaObj =
  zod.object({
    id: zod.number().min(1).optional(),
    title: zod.string(),
    content: zod.string(),
    published: zod.boolean(),
    authorId: zod.number(),
  });


/**
 * @description describes the posts structure
 */
export type IPost = zod.infer<typeof postSchemaObj>;
