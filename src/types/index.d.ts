import {UserDBType} from "../repositories/users";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserDBType | null,
            userId: string | undefined,
        }
    }
}