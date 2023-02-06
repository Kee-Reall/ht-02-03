import request from 'supertest';
import app from "../../src/app"
import {Blogs, Comments, mRunDb, Posts, Users, Sessions, Attempts} from "../../src/adapters/mongooseCreater";


describe('to run all by one button', () => {

    beforeAll(async () => {
        await mRunDb()
    })

    describe('clearing all data', () => {

        it('should response with code 204', async () => {
            await request(app).delete('/api/testing/all-data').expect(204)
        })

        it('should be clear blogs in response', async () => {
            const response = await request(app).get('/api/blogs')
            expect(response.body.items.length).toBe(0)
        })

        it('count blogs should be 0', async () => {
            expect(await Blogs.count({})).toBe(0)
        })

        it('should be clear posts in response', async () => {
            const response = await request(app).get('/api/posts')
            expect(response.body.items.length).toBe(0)
        })

        it('count posts should be 0', async () => {
            expect(await Posts.count({})).toBe(0)
        })

        it('should be clear users in response', async () => {
            const response = await request(app).get('/api/users').set({Authorization: "Basic YWRtaW46cXdlcnR5"})
            expect(response.status).toBe(200)
            console.log(response.body)
            expect(response.body.items.length).toBe(0)
        })

        it('count users should be 0', async () => {
            expect(await Users.count({})).toBe(0)
        })

        it('count comments should be 0', async () => {
            expect(await Comments.count({})).toBe(0)
        })

        it('check for sessions', async () => {
            expect(await Sessions.count({})).toBe(0)
        })

        it('clear Attempts', async () => {
            expect(await Attempts.count({})).toBe(0)
        })
    })

    describe('blog endpoint', () => {
        const link: string = 'api/blogs'
        it('get root Structure', async () => {
            request(app).get(link)
                .then((res) => {
                    const {body: {page, pageCount, pageSize, totalCount, items}} = res
                    expect(page).toBe(1)
                    expect(pageCount).toBe(1)
                    expect(pageSize).toBe(10)
                    expect(totalCount).toEqual(expect.any(Number))
                    expect(items).toEqual(expect.any(Array))
                })
        })
        it('create correct Blog', async () => {
            const blogInput = {
                name: "coney",
                description: "jafar     ",
                websiteUrl: "string.kz"
            }
            const date = new Date().toISOString()
            request(app).post(link).send(blogInput)
                .then(res => {
                    const {status, body: {name, description, websiteUrl, id, createdAt}} = res
                    expect(status).toBe(201)
                    expect(name).toBe(blogInput.name)
                    expect(description).toBe(blogInput.description.trim())
                    expect(websiteUrl).toBe(websiteUrl)
                    expect(id.startsWith('bg')).toBe(true)
                    expect(id).toEqual(expect.any(String))
                    expect(createdAt).toEqual(date)
                })
        })
    })
})
