import request from 'supertest';
import app from "../../src/app"
import {Blogs, Comments, mRunDb, Posts, Users, Sessions, Attempts} from "../../src/adapters/mongooseCreater";
import {blogInputModel, blogViewModel} from "../../src/models/blogModel";
//@ts-ignore
import {isIsoDate} from "../helpers/isIsoDate";
import generateRandomString from "../../src/helpers/generateRandomString";
import {isValidHttpUrl} from "../helpers/isValidUrl";

describe('one button for every suit', () => {
    beforeAll(async () => {
        await mRunDb(true, 'mongodb://127.0.0.1:27017/test')
    })

    const BasicAuth = "Basic YWRtaW46cXdlcnR5"

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
            const response = await request(app).get('/api/users').set({Authorization: BasicAuth})
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

    describe('/blogs endpoint', () => {

        it('root Structure checker by GET /blogs', async () => {
            const res = await request(app).get('/api/blogs')
            console.log(res)
            const {body: {page, pagesCount, pageSize, totalCount, items}} = res
            expect(page).toBe(1)
            expect(pageSize).toBe(10)
            expect(totalCount).toEqual(expect.any(Number))
            expect(items).toEqual(expect.any(Array))
            expect(pagesCount).toEqual(0)
        })

        const blogInput: blogInputModel = {
            "name": "αυτος",
            "description": "εγο αγαπω σοθ",
            "websiteUrl": "string.kz"
        }

        it('should return 401 for not authorized', async () => {
            const res = await request(app).post('/api/blogs').send(blogInput)
            const res2 = await request(app).post('/api/blogs').send({})
            expect(res.status).toBe(401)
            expect(res2.status).toBe(401)
        })

        describe('should return 401 for wrong authorization', () => {
            const wrongAuth: any[] = [
                "Bearer YWRtaW46cXdlcnR5", "Basic cm9vdDpxd2VydHk=", "Basic YWRtaW46YXplcnR5",
                "BasicYWRtaW46YXplcnR5", "", "       ", null, false, true, NaN
            ]
            it.each(wrongAuth)('%p', async (arg) => {
                const res = await request(app).post('/api/blogs').set({Authorization: arg}).send(blogInput)
                expect(res.status).toBe(401)

            })
        })

        describe('create blog few times', () => {
            it.each([1, 2, 3])(' test number \'%i\'', async () => {
                const creationDate = Date.now()
                const res = await request(app).post('/api/blogs').set({Authorization: BasicAuth}).send(blogInput)
                const body: blogViewModel = res.body
                const {id, description, createdAt, name, websiteUrl} = body
                expect(res.status).toBe(201)
                expect(description).toBe(blogInput.description)
                expect(name).toBe(blogInput.name)
                expect(websiteUrl).toBe(blogInput.websiteUrl)
                expect(id).toEqual(expect.any(String))
                expect(id.startsWith('bg')).toBe(true)
                expect(new Date(createdAt).getTime()).toBeCloseTo(creationDate, -3)
                expect(isIsoDate(createdAt)).toBe(true)
            })
        })

        it('after last test item length should be three', async () => {
            const res = await request(app).get('/api/blogs')
            expect(res.status).toBe(200)
            expect(res.body.items.length).toBe(3)
        })

        it('should be 3 doc\'s in collection', async () => expect(await Blogs.count({})).toBe(3))

        describe('get in existed blog', () => {
            it.each(
                new Array(150).fill(true).map(() => generateRandomString())
            )('random id bg%s', (value: string) => {
                request(app).get(`/api/blogs/bg${value}`).expect(404)
            })
        })

        describe('1 get all take first 2 get it by id 3 update it 4 get it by id 5 delete it', () => {
            let blog: blogViewModel

            it('get all and take first', async () => {
                const response = await request(app).get('/api/blogs')
                const {body: {items}} = response
                expect(response.status).toBe(200)
                const [firstItem] = items
                blog = firstItem
                items.forEach((el: blogViewModel) => {
                    const {id, description, createdAt, name, websiteUrl} = el
                    expect(description).toEqual(expect.any(String))
                    expect(name).toEqual(expect.any(String))
                    expect(websiteUrl).toEqual(expect.any(String))
                    expect(isValidHttpUrl(websiteUrl)).toBe(true)
                    expect(id).toEqual(expect.any(String))
                    expect(id.startsWith('bg')).toBe(true)
                    expect(isIsoDate(createdAt)).toBe(true)
                })
            })

            it('getSame by id', async () => {
                const response = await request(app).get(`/api/blogs/${blog.id}`)

                expect(response.status).toBe(200)
                for (let key in response.body) {
                    // @ts-ignore
                    expect(response.body[key]).toBe(blog[key])
                }
            })

            const updateDto:blogInputModel = {
                "name":"it'sGonnaChange",
                "description":"atIWillWaitTillCatchYouLoveMeOneDay",
                "websiteUrl": "afterChange.com"
            }

            it('update it', async () => {
                const response = await request(app).put(`/api/blogs/${blog.id}`).send(updateDto).set({Authorization:BasicAuth})
                expect(response.status).toBe(204)
            })

            it('get again with correct data',async ()=> {
                const res = await request(app).get('/api/blogs/' + blog.id)
                expect(res.status).toBe(200)
                expect(res.body.name).toBe(updateDto.name)
                expect(res.body.description).toBe(updateDto.description)
                expect(res.body.websiteUrl).toBe(updateDto.websiteUrl)
            })

            it('delete it',async () => {
                const res = await request(app).delete('/api/blogs/' + blog.id).set({Authorization:BasicAuth})
                expect(res.status).toBe(204)
                expect(res.body).toEqual({})
            })

            it('delete again should be 404',async () => {
                const res = await request(app).get('/api/blogs/' + blog.id).set({Authorization:BasicAuth})
                expect(res.status).toBe(404)
                expect(res.body).toEqual({})

            })

            it('get again but now it\'s not existing ',async ()=> {
                const res = await request(app).get('/api/blogs/' + blog.id)
                expect(res.status).toBe(404)
                expect(res.body).toEqual({})

            })
        })

        // describe('create with incorrect data',() => {
        //     it()
        // })
    })
})