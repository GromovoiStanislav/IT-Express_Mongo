
export type CommentInputModel = {
    content: string,
}

export type CommentsViewModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentViewModel[]
}


export type CommentViewModel = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt: string,
    likesInfo:likesInfoViewModel
}

export type likesInfoViewModel = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
}

export type CommentsRawViewModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentRawViewModel[]
}

export type CommentRawViewModel = {
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt: string,
}