"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../src/index");
async function* asyncGenerator(n) {
    let i = 1;
    while (i <= n) {
        yield i++;
    }
}
describe('blogs', () => {
    let newBlog = null;
    // beforeAll(async () => {
    //     await request(app).delete('/testing/all-data')
    // })
    // beforeEach(async () => {
    //     await request(app).delete('/testing/all-data')
    // })
    it('delete all data', async () => {
        await (0, supertest_1.default)(index_1.app).delete('/testing/all-data');
        await (0, supertest_1.default)(index_1.app).get('/blogs')
            .expect(200, {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        });
        await (0, supertest_1.default)(index_1.app).get('/posts')
            .expect(200, {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        });
    });
    // blogs
    it('not Authorization POST blog', async () => {
        await (0, supertest_1.default)(index_1.app).post('/blogs').send({
            name: 'new blog',
            youtubeUrl: 'https://someurl.com',
        }).expect(401);
        await (0, supertest_1.default)(index_1.app).get('/blogs')
            .expect(200, {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        });
    });
    it('bad request blog POST blog', async () => {
        const res = await (0, supertest_1.default)(index_1.app)
            .post('/blogs')
            .send({
            name: '',
            youtubeUrl: 'https://someurl.com',
        })
            //.auth('admin', 'qwerty')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5');
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "name"
                }
            ]
        });
        await (0, supertest_1.default)(index_1.app).get('/blogs')
            .expect(200, {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        });
    });
    it('create blog', async () => {
        const res = await (0, supertest_1.default)(index_1.app)
            .post('/blogs')
            .send({
            name: 'new blog',
            youtubeUrl: 'https://someurl.com',
        })
            //.auth('admin', 'qwerty')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5');
        expect(res.status).toBe(201);
        newBlog = res.body;
        expect(newBlog).toEqual({
            id: expect.any(String),
            name: 'new blog',
            youtubeUrl: 'https://someurl.com',
            createdAt: expect.any(String)
        });
        await (0, supertest_1.default)(index_1.app).get('/blogs')
            .expect(200, {
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [newBlog]
        });
    });
    it('get blog by id', async () => {
        await (0, supertest_1.default)(index_1.app).get(`/blogs/${newBlog.id}`)
            .expect(200, newBlog);
    });
    it('not get blog by wrong id', async () => {
        await (0, supertest_1.default)(index_1.app).get('/blogs/16')
            .expect(404);
    });
    it('not update blog by wrong id', async () => {
        await (0, supertest_1.default)(index_1.app).put('/blogs/16')
            .send({
            name: 'update blog',
            youtubeUrl: 'https://someurl.com',
        })
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404);
        await (0, supertest_1.default)(index_1.app).get('/blogs/16')
            .expect(404);
    });
    it('not Authorization PUT blog', async () => {
        await (0, supertest_1.default)(index_1.app).put(`/blogs/${newBlog.id}`)
            .send({
            name: 'update blog',
            youtubeUrl: 'https://someurl.com',
        })
            .expect(401);
        await (0, supertest_1.default)(index_1.app).get(`/blogs/${newBlog.id}`)
            .expect(200, newBlog);
    });
    it('not update blog bad request', async () => {
        const res = await (0, supertest_1.default)(index_1.app).put(`/blogs/${newBlog.id}`)
            .send({
            name: 'update blog',
            youtubeUrl: '',
        })
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5');
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "youtubeUrl"
                }
            ]
        });
        await (0, supertest_1.default)(index_1.app).get(`/blogs/${newBlog.id}`)
            .expect(200, newBlog);
    });
    it('update blog', async () => {
        await (0, supertest_1.default)(index_1.app).put(`/blogs/${newBlog.id}`)
            .send({
            name: 'update blog',
            youtubeUrl: 'https://someurl.com',
        })
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204);
        newBlog.name = 'update blog';
        await (0, supertest_1.default)(index_1.app).get(`/blogs/${newBlog.id}`)
            .expect(200, newBlog);
    });
    it('not delete blog by wrong id', async () => {
        await (0, supertest_1.default)(index_1.app).delete('/blogs/16')
            .send({
            name: 'update blog',
            youtubeUrl: 'https://someurl.com',
        })
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404);
    });
    it('not Authorization DELETE blog', async () => {
        await (0, supertest_1.default)(index_1.app).delete(`/blogs/${newBlog.id}`)
            .send({
            name: 'update blog',
            youtubeUrl: 'https://someurl.com',
        })
            .expect(401);
        await (0, supertest_1.default)(index_1.app).get(`/blogs/${newBlog.id}`)
            .expect(200, newBlog);
    });
    it('delete blog', async () => {
        await (0, supertest_1.default)(index_1.app).delete(`/blogs/${newBlog.id}`)
            .send({
            name: 'update blog',
            youtubeUrl: 'https://someurl.com',
        })
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204);
        await (0, supertest_1.default)(index_1.app).get(`/blogs/${newBlog.id}`)
            .expect(404);
    });
    it('query params blogs', async () => {
        await (0, supertest_1.default)(index_1.app).get('/blogs')
            .expect(200, {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        });
        // await request(app).delete('/testing/all-data')
        const arrBlogs = [];
        for await (let i of asyncGenerator(20)) {
            const res = await (0, supertest_1.default)(index_1.app)
                .post('/blogs')
                .send({
                name: 'new blog ' + i,
                youtubeUrl: 'https://someurl.com',
            })
                //.auth('admin', 'qwerty')
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5');
            arrBlogs.push(res.body);
        }
        const res = await (0, supertest_1.default)(index_1.app).get('/blogs?sortDirection=asc');
        expect(res.body.pagesCount).toBe(2);
        expect(res.body.page).toBe(1);
        expect(res.body.pageSize).toBe(10);
        expect(res.body.totalCount).toBe(20);
        expect(res.body.items.length).toBe(10);
    });
});
describe('logs/id/posts', () => {
    let newBlog = null;
    let newPost = null;
    beforeAll(async () => {
        await (0, supertest_1.default)(index_1.app).delete('/testing/all-data');
    });
    // blogs/id/posts
    it('create post by blogId', async () => {
        //PREPARE
        let res = await (0, supertest_1.default)(index_1.app)
            .post('/blogs')
            .send({
            name: 'new blog',
            youtubeUrl: 'https://someurl.com',
        })
            //.auth('admin', 'qwerty')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5');
        newBlog = res.body;
        ///START
        res = await (0, supertest_1.default)(index_1.app)
            .post(`/blogs/${newBlog.id}/posts`)
            .send({
            title: "post",
            shortDescription: "new post",
            content: "content of new blog"
        })
            //.auth('admin', 'qwerty')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5');
        expect(res.status).toBe(201);
        newPost = res.body;
        expect(newBlog).toEqual({
            id: expect.any(String),
            title: "post",
            shortDescription: "new blog",
            content: "content of new blog",
            blogId: newBlog.id,
            blogName: "new blog",
            createdAt: expect.any(String)
        });
        await (0, supertest_1.default)(index_1.app).get('/posts')
            .expect(200, {
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [newPost]
        });
    });
});
//# sourceMappingURL=api.test.js.map