import {Router, Request, Response} from 'express'
import {Blogs} from '../repositories/blogs'
import {auth} from "../middlewares/authorization";
import {body} from 'express-validator';
import {inputValidation} from '../middlewares/input-validation'


const router = Router();


router.get('/', (req: Request, res: Response) => {
    res.send(Blogs.getAll())
})

router.get('/:id', (req: Request, res: Response) => {
    const item = Blogs.findByID(req.params.id)
    if (item) {
        res.send(item)
    } else {
        res.send(404)
    }
})

router.delete('/:id', auth, (req: Request, res: Response) => {
    if (Blogs.deleteByID(req.params.id)) {
        res.send(204)
    } else {
        res.send(404)
    }
})


const regex = new RegExp('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
const validator = [
    body('name').notEmpty().trim().isLength({max: 15}),
    body('youtubeUrl').notEmpty().trim().isLength({max: 100}).matches(regex)
]


router.post('/', auth, validator, inputValidation, (req: Request, res: Response) => {
    const data = {
        name: req.body.name,
        youtubeUrl: req.body.youtubeUrl
    }
    res.status(201).send(Blogs.createNewBlog(data))
})

router.put('/:id', auth, validator, inputValidation, (req: Request, res: Response) => {
    const data = {
        name: req.body.name,
        youtubeUrl: req.body.youtubeUrl
    }

    if (Blogs.updateBlog(req.params.id, data)) {
        res.send(204)
    } else {
        res.send(404)
    }

})


export const clearAllBlogs = () => {
    Blogs.clearAll()
}

export default router