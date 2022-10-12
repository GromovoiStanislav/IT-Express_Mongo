import {UserViewModel} from "./users";


export type CommentInputModel = {
    content: string,
}

export type CommentViewModel = {
    id?: string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt?: string,
}


export type CommentsViewModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentViewModel[]
}
