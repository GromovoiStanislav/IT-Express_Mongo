import {Router, Request, Response} from 'express'
import {isArray} from "util";

const router = Router();


interface video {
    id?: int,
    title?: string,
    author?: string,
    canBeDownloaded?: boolean,
    minAgeRestriction?: null | number,
    availableResolutions?: Array<string>,
    createdAt?: string,
    publicationDate?: string,
}


const videosBD: Array<video> = []

router.get('/', (req: Request, res: Response) => {
    res.send(videosBD)
})

router.get('/:id', (req: Request, res: Response) => {
    const item = videosBD.find(v => v.id == id)
    if (item) {
        res.send(item)
    } else {
        res.send(404)
    }
})


router.delete('/:id', (req: Request, res: Response) => {
    const itemId = videosBD.findIndex(v => v.id == id)
    if (itemId >= 0) {
        videosBD.splice(itemId, 1)
        res.send(204)
    } else {
        res.send(404)
    }
})


router.post('/', (req: Request, res: Response) => {
    const errorsMessages: Array<any> = []
    let availableResolutions: Array<string> = []

    if (!req.body.title) {
        errorsMessages.push({message: 'title required', field: 'title'})
    } else if (req.body.title.lenght > 40) {
        errorsMessages.push({message: 'maxLength: 40', field: 'title'})
    }

    if (!req.body.author) {
        errorsMessages.push({message: 'author required', field: 'author'})
    } else if (req.body.author.lenght > 40) {
        errorsMessages.push({message: 'maxLength: 20', field: 'author'})
    }


    if ((req.body.availableResolutions) && (Array.isArray(req.body.availableResolutions))) {

        if (req.body.availableResolutions.lenght) {
            errorsMessages.push({message: 'At least one resolution should be added', field: 'availableResolutions'})
        } else {
            availableResolutions = req.body.availableResolutions.map((el: any) => el.toString())
        }
    }


    if (errorsMessages.length) {
        res.status(400).send({errorsMessages: errorsMessages})
    } else {

        const newDate = new Date();

        const newItem = {
            id: videosBD.length,
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            availableResolutions: availableResolutions,
            createdAt: newDate.toString(),
            publicationDate: newDate.setDate(newDate.getDate() + 1).toString(),
        }

        res.status(201).send(newItem)
    }
})


router.put('/:id', (req: Request, res: Response) => {

    const itemId = videosBD.findIndex(v => v.id == id)
    if (itemId == -1) {
        res.send(404)
        return
    }

    const errorsMessages: Array<any> = []
    let availableResolutions: Array<string> = []


    if (!req.body.title) {
        errorsMessages.push({message: 'title required', field: 'title'})
    } else if (req.body.title.lenght > 40) {
        errorsMessages.push({message: 'maxLength: 40', field: 'title'})
    }

    if (!req.body.author) {
        errorsMessages.push({message: 'author required', field: 'author'})
    } else if (req.body.author.lenght > 40) {
        errorsMessages.push({message: 'maxLength: 20', field: 'author'})
    }


    if ((req.body.availableResolutions) && (Array.isArray(req.body.availableResolutions))) {

        if (req.body.availableResolutions.lenght) {
            errorsMessages.push({message: 'At least one resolution should be added', field: 'availableResolutions'})
        } else {
            availableResolutions = req.body.availableResolutions.map((el: any) => el.toString())
        }
    }

    const newItem: video = {
        title: req.body.title,
        author: req.body.author,
        availableResolutions: availableResolutions,
    }

    if (req.body.canBeDownloaded && req.body.canBeDownloaded instanceof Boolean) {
        newItem.canBeDownloaded = req.body.canBeDownloaded
    }

    if (req.body.publicationDate) {
        newItem.publicationDate = req.body.publicationDate
    }

    if (req.body.minAgeRestriction && req.body.minAgeRestriction instanceof Number) {
        if (req.body.minAgeRestriction > 0 && req.body.minAgeRestriction < 19)
            newItem.minAgeRestriction = req.body.minAgeRestriction
    }

    if (errorsMessages.length) {
        res.status(400).send({errorsMessages: errorsMessages})
    } else {
        videosBD[itemId] = {...videosBD[itemId], ...newItem}
        res.send(204)
    }
})


export const clearAllVideos = () => {
    videosBD.length = 0
}

export default router