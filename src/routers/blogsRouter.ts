import {Router, Request, Response} from 'express'
import {BlogsService} from '../domain/blogs-services'
import {auth} from "../middlewares/authorization";
import {body} from 'express-validator';
import {inputValidation} from '../middlewares/input-validation'


const router = Router();


router.get('/', async (req: Request, res: Response) => {
    const searchNameTerm = req.query.searchNameTerm?.toString() || ''
    const pageNumber = req.query.pageNumber?.toString() || ''
    const pageSize = req.query.pageSize?.toString() || ''
    const sortBy = req.query.sortBy?.toString() || ''
    const sortDirection = req.query.desc?.toString() || ''

    const result = await BlogsService.getAll(searchNameTerm,pageNumber,pageSize,sortBy,sortDirection)
    res.send(result)
})

router.get('/:id', async (req: Request, res: Response) => {
    const item = await BlogsService.findByID(req.params.id)
    if (item) {
        res.send(item)
    } else {
        res.sendStatus(404)
    }
})

router.delete('/:id', auth, async (req: Request, res: Response) => {
    const result = await BlogsService.deleteByID(req.params.id)
    if (result) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})


//const regex = new RegExp('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
const regex:RegExp = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/

const validator = [
    body('name').trim().notEmpty().isString().isLength({max: 15}),
    body('youtubeUrl').trim().notEmpty().isString().isLength({max: 100}).matches(regex),
]


router.post('/', auth, validator, inputValidation, async (req: Request, res: Response) => {
    const data = {
        name: req.body.name.trim(),
        youtubeUrl: req.body.youtubeUrl.trim()
    }
    const result = await BlogsService.createNewBlog(data)
    res.status(201).send(result)
})

router.put('/:id', auth, validator, inputValidation, async(req: Request, res: Response) => {
    const data = {
        name: req.body.name.trim(),
        youtubeUrl: req.body.youtubeUrl.trim()
    }

    const result = await BlogsService.updateBlog(req.params.id, data)
    if (result) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }

})


export const clearAllBlogs = async () => {
    await BlogsService.clearAll()
}

export default router