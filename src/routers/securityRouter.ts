import {Router, Request, Response} from 'express'

import {SecurityService} from "../domain/security-services";


const router = Router();
export default router


////////////////////////////
router.get('/devices', async (req: Request, res: Response) => {
    const result = await SecurityService.getAllByUserId(req.cookies.refreshToken)
    if (!result) {
        return res.sendStatus(401)
    }
    res.status(200).send({result})
})


//////////////////////////////////
router.delete('/devices', async (req: Request, res: Response) => {
    const result = await SecurityService.deleteAllOtherExcludeCarrentDeviceId(req.cookies.refreshToken)
    if (!result) {
        return res.sendStatus(401)
    }
    res.sendStatus(204)
})


//////////////////////////////////
router.delete('/devices/:deviceId', async (req: Request, res: Response) => {
    const result = await SecurityService.deleteByDeviceId(req.cookies.refreshToken, req.params.deviceId)
    res.sendStatus(result)
})