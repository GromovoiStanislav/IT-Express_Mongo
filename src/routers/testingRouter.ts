import {Router, Request, Response} from 'express'
import {clearAllBlogs} from "./blogsRouter";
import {clearAllPosts} from "./postsRouter";
import {clearAllUsers} from "./usersRouter";
import {clearAllComments} from "./commentsRouter";


const router = Router();
export default router

router.delete('/all-data', async (req: Request, res: Response) => {
    await clearAllBlogs()
    await clearAllPosts()
    await clearAllUsers()
    await clearAllComments()
    res.sendStatus(204)
})
