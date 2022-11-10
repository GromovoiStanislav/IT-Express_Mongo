
export type PostInputModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,

}


export type LikesDetailsViewModel = {
    addedAt: string,
    userId: string,
    login: string
}


export type ExtendedLikesInfoViewModel = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
    newestLikes:LikesDetailsViewModel[]
}

// export type LikesInfoViewModel = {
//     likesCount: number,
//     dislikesCount: number,
//     myStatus: string,
// }

export type PostViewModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo?:ExtendedLikesInfoViewModel
}

export type PaginatorPostViewModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostViewModel[]
}