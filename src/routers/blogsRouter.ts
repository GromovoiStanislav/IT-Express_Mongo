import {Router, Request, Response} from 'express'
//import {Blogs} from '../repositories/blogs'
import {Blogs} from '../repositories/blogsDB'
import {auth} from "../middlewares/authorization";
import {body} from 'express-validator';
import {inputValidation} from '../middlewares/input-validation'


const router = Router();


router.get('/', async (req: Request, res: Response) => {
    const result = await Blogs.getAll()
    res.send(result)
})

router.get('/:id', async (req: Request, res: Response) => {
    const item = await Blogs.findByID(req.params.id)
    if (item) {
        res.send(item)
    } else {
        res.send(404)
    }
})

router.delete('/:id', auth, async (req: Request, res: Response) => {
    const result = await Blogs.deleteByID(req.params.id)
    if (result) {
        res.send(204)
    } else {
        res.send(404)
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
    const result = await Blogs.createNewBlog(data)
    res.status(201).send(result)
})

router.put('/:id', auth, validator, inputValidation, async(req: Request, res: Response) => {
    const data = {
        name: req.body.name.trim(),
        youtubeUrl: req.body.youtubeUrl.trim()
    }

    const result = await Blogs.updateBlog(req.params.id, data)
    if (result) {
        res.send(204)
    } else {
        res.send(404)
    }

})


export const clearAllBlogs = async () => {
    await Blogs.clearAll()
}

export default router