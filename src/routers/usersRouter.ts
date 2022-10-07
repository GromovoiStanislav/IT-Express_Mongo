import {Router, Request, Response} from 'express'

import {auth} from "../middlewares/authorization";
import {body,query} from 'express-validator';
import {paginationQuerySanitizer,inputValidation,paginationParams} from '../middlewares/input-validation'
import {UsersService} from "../domain/users-services";

const router = Router();

export const clearAllUsers = async () => {
    await UsersService.clearAll()
}

export default router