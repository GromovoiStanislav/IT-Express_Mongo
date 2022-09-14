import {Router, Request, Response} from 'express'

const router = Router();


interface video {
    id?: number,
    title?: string,
    author?: string,
    canBeDownloaded?: boolean,
    minAgeRestriction?: null | number,
    availableResolutions?: Array<string>,
    createdAt?: string,
    publicationDate?: string,
}

const availableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]


const videosBD: Array<video> = []

router.get('/', (req: Request, res: Response) => {
    res.send(videosBD)
})

router.get('/:id', (req: Request, res: Response) => {
    const item = videosBD.find(v => v.id == +req.params.id)
    if (item) {
        res.send(item)
    } else {
        res.send(404)
    }
})


router.delete('/:id', (req: Request, res: Response) => {
    const itemId = videosBD.findIndex(v => v.id == +req.params.id)
    if (itemId >= 0) {
        videosBD.splice(itemId, 1)
        res.send(204)
    } else {
        res.send(404)
    }
})


router.post('/', (req: Request, res: Response) => {
    const errorsMessages: Array<any> = []


    if (!req.body.title) {
        errorsMessages.push({message: 'title required', field: 'title'})
    } else if (req.body.title.length > 40) {
        errorsMessages.push({message: 'maxLength: 40', field: 'title'})
    }


    if (!req.body.author) {
        errorsMessages.push({message: 'author required', field: 'author'})
    } else if (req.body.author.length > 20) {
        errorsMessages.push({message: 'maxLength: 20', field: 'author'})
    }


    if ((req.body.availableResolutions) && (Array.isArray(req.body.availableResolutions))) {

        const resolutions = req.body.availableResolutions

        if (resolutions.length == 0) {
            errorsMessages.push({message: 'At least one resolution should be added', field: 'availableResolutions'})
        } else {

            for (let i: number = 0; i < resolutions.length; i++) {
                if (availableResolutions.indexOf(resolutions[i]) == -1) {
                    errorsMessages.push({message: 'incorrect value', field: 'availableResolutions'})
                    break
                }
            }
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
            availableResolutions: req.body.availableResolutions,
            createdAt: newDate.toISOString(),
            publicationDate: new Date(newDate.setDate(newDate.getDate() + 1)).toISOString(),
        }
        videosBD.push(newItem)

        res.status(201).send(newItem)
    }
})


router.put('/:id', (req: Request, res: Response) => {

    const itemId = videosBD.findIndex(v => v.id == +req.params.id)
    if (itemId == -1) {
        res.send(404)
        return
    }

    const errorsMessages: Array<any> = []

    if (!req.body.title) {
        errorsMessages.push({message: 'title required', field: 'title'})
    } else if (req.body.title.length > 40) {
        errorsMessages.push({message: 'maxLength: 40', field: 'title'})
    }

    if (!req.body.author) {
        errorsMessages.push({message: 'author required', field: 'author'})
    } else if (req.body.author.length > 20) {
        errorsMessages.push({message: 'maxLength: 20', field: 'author'})
    }


    if ((req.body.availableResolutions) && (Array.isArray(req.body.availableResolutions))) {

        const resolutions = req.body.availableResolutions

        if (resolutions.length == 0) {
            errorsMessages.push({message: 'At least one resolution should be added', field: 'availableResolutions'})
        } else {
            for (let i: number = 0; i < resolutions.length; i++) {
                if (availableResolutions.indexOf(resolutions[i]) == -1) {
                    errorsMessages.push({message: 'incorrect value', field: 'availableResolutions'})
                    break
                }
            }
        }
    }


    const newItem: video = {
        title: req.body.title,
        author: req.body.author,
        availableResolutions: req.body.availableResolutions,
    }

    if (req.body.canBeDownloaded) {
        if (typeof req.body.canBeDownloaded == 'boolean') {
            newItem.canBeDownloaded = req.body.canBeDownloaded
        } else {
            errorsMessages.push({message: 'canBeDownloaded must be boolean', field: 'canBeDownloaded'})
        }
    }

    if (req.body.publicationDate) {
        const prevDate = ''+videosBD[itemId].publicationDate
        if (new Date(req.body.publicationDate) < new Date(prevDate)) {
            errorsMessages.push({message: 'incorrect publicationDate', field: 'publicationDate'})
        } else {
            newItem.publicationDate = req.body.publicationDate.toISOString()
        }

    }

    if (req.body.minAgeRestriction) {
        if (req.body.minAgeRestriction > 0 && req.body.minAgeRestriction < 19) {
            newItem.minAgeRestriction = req.body.minAgeRestriction
        } else {
            errorsMessages.push({message: 'minAgeRestriction must be from 1 to 18', field: 'minAgeRestriction'})
        }
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