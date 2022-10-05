import request from 'supertest'
import {app} from '../src/index'

async function* asyncGenerator(n: number) {
    let i = 1;
    while (i <= n) {
        yield i++;
    }
}


describe('blogs', () => {
    let newBlog: any = null

    // beforeAll(async () => {
    //     await request(app).delete('/testing/all-data')
    // })

    // beforeEach(async () => {
    //     await request(app).delete('/testing/all-data')
    // })

    it('delete all data', async () => {
        await request(app).delete('/testing/all-data')
        await request(app).get('/blogs')
            .expect(200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }
            )
        await request(app).get('/posts')
            .expect(200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }
            )

    })

    // blogs
    it('not Authorization POST blog', async () => {
        await request(app).post('/blogs').send({
            name: 'new blog',
            youtubeUrl: 'https://someurl.com',
        }).expect(401)

        await request(app).get('/blogs')
            .expect(200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }
            )
    })

    it('bad request blog POST blog', async () => {
        const res = await request(app)
            .post('/blogs')
            .send({
                name: '',
                youtubeUrl: 'https://someurl.com',
            })
            //.auth('admin', 'qwerty')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')

        expect(res.status).toBe(400);
        expect(res.body).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "name"
                    }
                ]
            }
        )

        await request(app).get('/blogs')
            .expect(200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }
            )


    })

    it('create blog', async () => {
        const res = await request(app)
            .post('/blogs')
            .send({
                name: 'new blog',
                youtubeUrl: 'https://someurl.com',
            })
            //.auth('admin', 'qwerty')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')

        expect(res.status).toBe(201);

        newBlog = res.body

        expect(newBlog).toEqual({
            id: expect.any(String),
            name: 'new blog',
            youtubeUrl: 'https://someurl.com',
            createdAt: expect.any(String)
        })

        await request(app).get('/blogs')
            .expect(200, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [newBlog]
                }
            )
    })

    it('get blog by id', async () => {
        await request(app).get(`/blogs/${newBlog.id}`)
            .expect(200, newBlog)
    })

    it('not get blog by wrong id', async () => {
        await request(app).get('/blogs/16')
            .expect(404)
    })

    it('not update blog by wrong id', async () => {
        await request(app).put('/blogs/16')
            .send({
                name: 'update blog',
                youtubeUrl: 'https://someurl.com',
            })
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)

        await request(app).get('/blogs/16')
            .expect(404)
    })

    it('not Authorization PUT blog', async () => {
        await request(app).put(`/blogs/${newBlog.id}`)
            .send({
                name: 'update blog',
                youtubeUrl: 'https://someurl.com',
            })
            .expect(401)

        await request(app).get(`/blogs/${newBlog.id}`)
            .expect(200, newBlog)
    })

    it('not update blog bad request', async () => {
        const res = await request(app).put(`/blogs/${newBlog.id}`)
            .send({
                name: 'update blog',
                youtubeUrl: '',
            })
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')

        expect(res.status).toBe(400);
        expect(res.body).toEqual(
            {
                "errorsMessages": [
                    {
                        "message": expect.any(String),
                        "field": "youtubeUrl"
                    }
                ]
            }
        )

        await request(app).get(`/blogs/${newBlog.id}`)
            .expect(200, newBlog)
    })

    it('update blog', async () => {
        await request(app).put(`/blogs/${newBlog.id}`)
            .send({
                name: 'update blog',
                youtubeUrl: 'https://someurl.com',
            })
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)

        newBlog.name = 'update blog'

        await request(app).get(`/blogs/${newBlog.id}`)
            .expect(200, newBlog)
    })

    it('not delete blog by wrong id', async () => {
        await request(app).delete('/blogs/16')
            .send({
                name: 'update blog',
                youtubeUrl: 'https://someurl.com',
            })
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)

    })

    it('not Authorization DELETE blog', async () => {
        await request(app).delete(`/blogs/${newBlog.id}`)
            .send({
                name: 'update blog',
                youtubeUrl: 'https://someurl.com',
            })
            .expect(401)

        await request(app).get(`/blogs/${newBlog.id}`)
            .expect(200, newBlog)
    })

    it('delete blog', async () => {
        await request(app).delete(`/blogs/${newBlog.id}`)
            .send({
                name: 'update blog',
                youtubeUrl: 'https://someurl.com',
            })
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)

        await request(app).get(`/blogs/${newBlog.id}`)
            .expect(404)
    })

    it('query params blogs', async () => {

        await request(app).get('/blogs')
            .expect(200, {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }
            )

        // await request(app).delete('/testing/all-data')

        const arrBlogs = []

        for await (let i of asyncGenerator(20)) {
            const res = await request(app)
                .post('/blogs')
                .send({
                    name: 'new blog ' + i,
                    youtubeUrl: 'https://someurl.com',
                })
                //.auth('admin', 'qwerty')
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            arrBlogs.push(res.body)
        }

        const res = await request(app).get('/blogs?sortDirection=asc')
        expect(res.body.pagesCount).toBe(2)
        expect(res.body.page).toBe(1)
        expect(res.body.pageSize).toBe(10)
        expect(res.body.totalCount).toBe(20)
        expect(res.body.items.length).toBe(10)
    })


})

describe('blogs/id/posts', () => {
    let newBlog: any = null
    let newPost: any = null

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('create post by blogId', async () => {
        //PREPARE
        let res = await request(app)
            .post('/blogs')
            .send({
                name: 'new blog',
                youtubeUrl: 'https://someurl.com',
            })
            //.auth('admin', 'qwerty')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        newBlog = res.body

        ///START BAD
        await request(app)
            .post('/blogs/16/posts')
            .send({
                title: "post",
                shortDescription: "new post",
                content: "content of new post"
            })
            .auth('admin', 'qwerty')
            .expect(404)

        await request(app)
            .post('/blogs/16/posts')
            .send({
                title: "post",
                shortDescription: "new post",
                content: "content of new post"
            })
            .auth('admin', '123')
            .expect(401)

        await request(app)
            .post('/blogs/16/posts')
            .send({
                title: "",
                shortDescription: "new post",
                content: "content of new post"
            })
            .auth('admin', 'qwerty')
            .expect(400, {
                "errorsMessages": [
                    {
                        "message": 'Invalid value',
                        "field": "title"
                    }
                ]
            })


        await request(app)
            .post(`/blogs/${newBlog.id}/posts`)
            .send({
                title: "post",
                shortDescription: "new post",
                content: "content of new post"
            })
            .auth('admin', '123')
            .expect(401)

        await request(app)
            .post(`/blogs/${newBlog.id}/posts`)
            .send({
                title: "",
                shortDescription: "new post",
                content: "content of new post"
            })
            .auth('admin', 'qwerty')
            .expect(400 , {
                "errorsMessages": [
                    {
                        "message": 'Invalid value',
                        "field": "title"
                    }
                ]
            } )


        ///START GOOD
        res = await request(app)
            .post(`/blogs/${newBlog.id}/posts`)
            .send({
                title: "post",
                shortDescription: "new post",
                content: "content of new post"
            })
            .auth('admin', 'qwerty')

        expect(res.status).toBe(201);
        newPost = res.body
        expect(newPost).toEqual({
            id: expect.any(String),
            title: "post",
            shortDescription: "new post",
            content: "content of new post",
            blogId: newBlog.id,
            blogName: "new blog",
            createdAt: expect.any(String)
        })

        await request(app).get('/posts')
            .expect(200, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [newPost]
                }
            )
    })

    it('get posts by blogId', async () => {

        await request(app).get('/blogs/16/posts')
            .expect(404)

        await request(app).get(`/blogs/${newBlog.id}/posts`)
            .expect(200, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [newPost]
                }
            )
    })

})