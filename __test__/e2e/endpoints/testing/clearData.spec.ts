import request from 'supertest';
import app from "../../../../src/app";
import {blogs, comments, posts, users} from "../../../../src/adapters/mongoConnectorCreater";
describe('clearing all data', () => {

    describe('Clear all data, then other request', async () => {

       await request(app).delete('api/testing/all-data').expect(204)

        it('should be clear blogs in response', async () => {
            const response = await request(app).get('/api/blogs')
            expect(response.body.items.length).toBe(0)
        })

       it('count blogs should be 0',async () => {
           expect(await blogs.count({})).toBe(0)
       })

        it('should be clear posts in response', async () => {
            const response = await request(app).get('/api/posts')
            expect(response.body.items.length).toBe(0)
        })

        it('count posts should be 0',async () => {
            expect(await posts.count({})).toBe(0)
        })

        it('should be clear users in response', async () => {
            const response = await request(app).get('/api/users').set({Authorization: "Basic c2FtdXJhaTpzZWNyZXQlQC1wYXNzd29yZCQkIyUh"})
            expect(response.body.items.length).toBe(0)
        })

        it('count users should be 0',async () => {
            expect(await users.count({})).toBe(0)
        })

        it('count comments should be 0' , async () => {
            expect(await comments.count({})).toBe(0)
        })
    })
})