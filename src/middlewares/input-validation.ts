import {Request, Response, NextFunction} from 'express'

import {validationResult} from 'express-validator';


export const inputValidation =
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            const errorsMessages = errors.array({onlyFirstError:true}).map(err=>({
                "message": err.msg,
                "field": err.param
            }))

            res.status(400).json({errorsMessages: errorsMessages});
        } else {
            next()
        }
    }