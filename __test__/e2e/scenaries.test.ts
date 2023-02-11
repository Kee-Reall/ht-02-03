import request from 'supertest';
import app from "../../src/app"
import {Blogs, Comments, mRunDb, Posts, Users, Sessions, Attempts} from "../../src/adapters/mongooseCreater";
import {blogInputModel, blogViewModel} from "../../src/models/blogModel";
//@ts-ignore
import {isIsoDate} from "../helpers/isIsoDate";
import generateRandomString from "../../src/helpers/generateRandomString";

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

        describe('get in existed blog',()=>{
            it.each(
                new Array(15).fill(true).map( () => generateRandomString())
            )('random id bg%s', (value: string)=>{
                        request(app).get(`/api/blogs/bg${value}`).expect(404)
            })
        })

        // describe('1 get all 2 take first 3 get it by id 4 update it 5 get it by id again delete it',()=>{
        //     let blog: blogViewModel
        //     it('')
        // })
    })
})