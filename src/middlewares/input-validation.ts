import {Request, Response, NextFunction} from 'express'
import {validationResult, ValidationError, query} from 'express-validator';

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

export const defaultQuerySanitizer = [
    query('pageNumber').trim().toInt().default(1),
    query('pageSize').trim().toInt().default(10),
    query('sortBy').escape().trim().default('createdAt'),
    query('sortDirection').escape().trim().toLowerCase().customSanitizer(value => {
        if (['desc', 'asc'].includes(value)) {
            return value
        }
        return 'desc'
    }),
]

