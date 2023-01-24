import zod from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserRequest:
 *      type: object
 *      required:
 *        - email
 *        - name
 *      properties:
 *        email:
 *          type: string
 *          default: johndoe@site.com
 *        name:
 *          type: string
 *          default: john Doe
 *    CreateUserResponse:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - id
 *      properties:
 *        email:
 *          type: string
 *          default: johndoe@site.com
 *        name:
 *          type: string
 *          default: john Doe
 *        id:
 *          type: string
 *          description: this is a system generated field
 */
export const userSchemaObj =  zod.object({
    id: zod.number().min(1).optional(),
    email: zod.string(),
    name: zod.string(),
  })
;

export type IUser = zod.infer<typeof userSchemaObj>;
