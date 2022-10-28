import {Router, Request, Response} from 'express'

import {SecurityService} from "../domain/security-services";


const router = Router();
export default router

router.get('/devices', async (req: Request, res: Response) => {
    const result = await SecurityService.getAllByUserId(req.cookies.refreshToken)
    if (!result) {
        return res.sendStatus(401)
    }
    res.status(200).send({result})
})
