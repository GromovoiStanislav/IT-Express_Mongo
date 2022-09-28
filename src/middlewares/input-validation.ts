import {Request, Response, NextFunction} from 'express'
import {validationResult, ValidationError} from 'express-validator';

const errorFormatter = ({location, msg, param, value, nestedErrors}: ValidationError) => {
    return {message: msg, field: param}
};

export const inputValidation =
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty()) {
            res.status(400).json({errorsMessages: errors.array({onlyFirstError: true})});
        } else {
            next()
        }
    }

// export const inputValidation =
// (req: Request, res: Response, next: NextFunction) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//
//         const errorsMessages = errors.array({onlyFirstError:true}).map(err=>({
//             "message": err.msg,
//             "field": err.param
//         }))
//
//         res.status(400).json({errorsMessages: errorsMessages});
//     } else {
//         next()
//     }
// }