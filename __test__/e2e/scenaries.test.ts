import request from 'supertest';
import app from "../../src/app"
import {Blogs, Comments, mRunDb, Posts, Users, Sessions, Attempts} from "../../src/adapters/mongooseCreater";
import {BlogInputModel, BlogViewModel} from "../../src/models/blogModel";
//@ts-ignore
import {isIsoDate} from "../helpers/isIsoDate";
//@ts-ignore
import {isValidHttpUrl} from "../helpers/isValidUrl";
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

        const blogInput: BlogInputModel = {
            "name": "Ο χρυμας",
            "description": "πιάσε αν μπορείς",
            "websiteUrl": "string.kz"
        }

        describe('should return 401 for not authorized', () => {
            it('creation', async () => {
                const res = await request(app).post('/api/blogs').send(blogInput)
                const res2 = await request(app).post('/api/blogs').send({})
                expect(res.status).toBe(401)
                expect(res2.status).toBe(401)
            })

            it('updating', async () => {
                const res = await request(app).put('/api/blogs/bgrandom').send(blogInput)
                const res2 = await request(app).put('/api/blogs/bgrandom').send({})
                expect(res.status).toBe(401)
                expect(res2.status).toBe(401)
            })

            it('creation', async () => {
                const [res, res2, res3] = await Promise.all([
                    request(app).delete('/api/blogs/bgrandom').send(blogInput),
                    request(app).delete('/api/blogs/bgrandom').send({}),
                    request(app).delete('/api/blogs/bgrandom')
                ])
                expect(res3.status).toBe(401)
                expect(res.status).toBe(401)
                expect(res2.status).toBe(401)
            })
        })

        describe('should return 401 for wrong authorization', () => {
            const wrongAuth: any[] = [
                "Bearer YWRtaW46cXdlcnR5", "Basic cm9vdDpxd2VydHk=", "Basic YWRtaW46YXplcnR5",
                "BasicYWRtaW46YXplcnR5", "", "       ", null, false, true, NaN, "Basic:YWRtaW46YXplcnR5"
            ]
            describe('creation', () => {
                it.each(wrongAuth)('%p', async (arg) => {
                    const res = await request(app).post('/api/blogs').set({Authorization: arg}).send(blogInput)
                    expect(res.status).toBe(401)
                })
            })
            describe('updating', () => {
                it.each(wrongAuth)('%p', async (arg) => {
                    const res = await request(app).put('/api/blogs/bgrandomid').set({Authorization: arg}).send(blogInput)
                    expect(res.status).toBe(401)
                })
            })
            describe('deleting', () => {
                it.each(wrongAuth)('%p', async (arg) => {
                    const res = await request(app).delete('/api/blogs/bgrandomid').set({Authorization: arg})
                    expect(res.status).toBe(401)
                })
            })
        })

        describe('create blog few times', () => {
            it.each([1, 2, 3])(' test number \'%i\'', async () => {
                const creationDate = Date.now()
                const res = await request(app).post('/api/blogs').set({Authorization: BasicAuth}).send(blogInput)
                const body: BlogViewModel = res.body
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
            it('after last test item length should be three', async () => {
                const res = await request(app).get('/api/blogs')
                expect(res.status).toBe(200)
                expect(res.body.items.length).toBe(3)
            })

            it('should be 3 doc\'s in collection', async () => expect(await Blogs.countDocuments({})).toBe(3))

        })

        const updateDto: BlogInputModel = {
            "name": "it'sGonnaChange",
            "description": "atIWillWaitTillCatchYouLoveMeOneDay",
            "websiteUrl": "afterChange.com"
        }

        describe('unexciting blog', () => {
            describe('get by id', () => {
                it.each(
                    new Array(150).fill(true).map(() => generateRandomString())
                )('random id bg%s', (value: string) => {
                    request(app).get(`/api/blogs/bg${value}`).expect(404)
                })
            })

            describe('update by id', () => {
                it.each(
                    new Array(150).fill(true).map(() => generateRandomString())
                )('random id bg%s', async (value: string) => {
                    request(app)
                        .put(`/api/blogs/bg${value}`)
                        .send(blogInput)
                        .set({Authorization: BasicAuth})
                        .expect(404)
                })
            })

            describe('delete by id', () => {
                it.each(
                    new Array(150).fill(true).map(() => generateRandomString())
                )('delete id bg%s', async (value: string) => {
                    request(app)
                        .delete(`/api/blogs/bg${value}`)
                        .set({Authorization: BasicAuth})
                        .expect(404)
                })
            })
        })

        describe('1 get all take first 2 get it by id 3 update it 4 get it by id 5 delete it', () => {
            let blog: BlogViewModel

            it('get all and take first', async () => {
                const response = await request(app).get('/api/blogs')
                const {body: {items}} = response
                expect(response.status).toBe(200)
                const [firstItem] = items
                blog = firstItem
                items.forEach((el: BlogViewModel) => {
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

            it('update it', async () => {
                const response = await request(app).put(`/api/blogs/${blog.id}`).send(updateDto).set({Authorization: BasicAuth})
                expect(response.status).toBe(204)
            })

            it('get again with correct data', async () => {
                const res = await request(app).get('/api/blogs/' + blog.id)
                expect(res.status).toBe(200)
                expect(res.body.name).toBe(updateDto.name)
                expect(res.body.description).toBe(updateDto.description)
                expect(res.body.websiteUrl).toBe(updateDto.websiteUrl)
            })

            it('delete it', async () => {
                const res = await request(app).delete('/api/blogs/' + blog.id).set({Authorization: BasicAuth})
                expect(res.status).toBe(204)
                expect(res.body).toEqual({})
            })

            it('delete again should be 404', async () => {
                const res = await request(app).get('/api/blogs/' + blog.id).set({Authorization: BasicAuth})
                expect(res.status).toBe(404)
                expect(res.body).toEqual({})

            })

            it('get again but now it\'s not existing ', async () => {
                const res = await request(app).get('/api/blogs/' + blog.id)
                expect(res.status).toBe(404)
                expect(res.body).toEqual({})
            })

            it('update it, but it doesn\'t exist', async () => {
                const res = await request(app).put('/api/blogs/' + blog.id).send(updateDto).set({Authorization: BasicAuth})
                expect(res.status).toBe(404)
                expect(res.body).toEqual({})
            })

        })

        function checkIncorrectRes(res: request.Response) {
            expect(res.status).toBe(400)
            expect(res.body.errorsMessages).toBeDefined()
            expect(res.body.errorsMessages).toEqual(expect.any(Array))
            expect(res.body.errorsMessages[0].message).toEqual(expect.any(String))

        }

        describe('create with incorrect data', () => {

            const incorrect = [null, 0, 1, 2, 3, 1245154264623, 0x53, '', '       ']
            describe('incorrect name', () => {
                it.each([...incorrect, '1234567890123456'])('name: \'%p\'', async (name: any) => {
                    const res = await request(app).post('/api/blogs/').send({
                        ...blogInput,
                        name
                    }).set({Authorization: BasicAuth})
                    checkIncorrectRes(res)
                    expect(res.body.errorsMessages[0].field).toBe("name")
                })
            })
            describe('incorrect describe', () => {
                it.each([...incorrect, new Array(501).fill(true).map(() => '1').join('')])('content: \'%p\'', async (description: any) => {
                    const res = await request(app).post('/api/blogs/').send({
                        ...blogInput,
                        description
                    }).set({Authorization: BasicAuth})
                    checkIncorrectRes(res)
                    expect(res.body.errorsMessages[0].field).toBe("description")
                })
            })

            describe('incorrect url', () => {
                it.each([
                    ...incorrect, /*"http://www.asiom",*/ // need to do smthin' with this
                    "mongodb://www.string.kz", `https://${
                        new Array(90).fill(true).map(() => '1').join('')
                    }.kz`])('websiteUrl: \'%p\'', async (websiteUrl: any) => {
                    const res = await request(app).post('/api/blogs/').send({
                        ...blogInput,
                        websiteUrl
                    }).set({Authorization: BasicAuth})
                    checkIncorrectRes(res)
                    expect(res.body.errorsMessages[0].field).toBe("websiteUrl")
                })
            })
        })

        describe('update with incorrect data', () => {

            let id: string = ""
            let createdAt: string = ""

            beforeAll(async () => {
                const res = await request(app).post('/api/blogs').set({Authorization: BasicAuth}).send(blogInput)
                expect(res.status).toBe(201)
                id = res.body.id
                createdAt = res.body.createdAt
            })

            afterEach(async () => {
                const res = await request(app).get('/api/blogs/' + id)
                expect(res.status).toBe(200)
                expect(res.body.name).toBe(blogInput.name)
                expect(res.body.description).toBe(blogInput.description)
                expect(res.body.websiteUrl).toBe(blogInput.websiteUrl)
                expect(res.body.id).toBe(id)
                expect(res.body.createdAt).toBe(createdAt)
            })


            const incorrect = [null, 0, 1, 2, 3, 1245154264623, 0x53, '', '       ']
            describe('incorrect name', () => {
                it.each([...incorrect, '1234567890123456'])('name: \'%p\'', async (name: any) => {
                    const res = await request(app).put('/api/blogs/' + id).send({
                        ...updateDto,
                        name
                    }).set({Authorization: BasicAuth})
                    checkIncorrectRes(res)
                    expect(res.body.errorsMessages[0].field).toBe("name")
                })
            })

            describe('incorrect describe', () => {
                it.each([...incorrect, new Array(501).fill(true).map(() => '1').join('')])('content: \'%p\'', async (description: any) => {
                    const res = await request(app).put('/api/blogs/' + id).send({
                        ...updateDto,
                        description
                    }).set({Authorization: BasicAuth})
                    checkIncorrectRes(res)
                    expect(res.body.errorsMessages[0].field).toBe("description")
                })
            })

            describe('incorrect url', () => {
                it.each([
                    ...incorrect, /*"http://www.asiom",*/ // need to do smthin' with this
                    "mongodb://www.string.kz", `https://${
                        new Array(90).fill(true).map(() => '1').join('')
                    }.kz`])('websiteUrl: \'%p\'', async (websiteUrl: any) => {
                    const res = await request(app).put('/api/blogs/' + id).send({
                        ...updateDto,
                        websiteUrl
                    }).set({Authorization: BasicAuth})
                    checkIncorrectRes(res)
                    expect(res.body.errorsMessages[0].field).toBe("websiteUrl")
                })
            })
        })

        // describe('testing queryParams and pagination',()=>{
        //
        // })
    })
    // describe('/posts endpoint',()=>{
    //
    // })
    // describe('/blogs/id/posts endpoint',()=>{
    //
    // })
})