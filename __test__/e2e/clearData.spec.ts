import request from 'supertest';
import app from "../../src/app"
import {Blogs, Comments, mRunDb, Posts, Users, Sessions, Attempts} from "../../src/adapters/mongooseCreater";


describe('to run all by one button', () => {

    const [Authorization, Basis, Bearer, space, adminData, wrongPass] = ['Authorization', "Basic" ,"Bearer", ' ',"YWRtaW46cXdlcnR5", "YWRtaW5lOnF3ZXJ0eQ==" ]

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
        it('root Structure checker by GET /blogs', async () => {
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

        it('should return 404', async () => {
            request(app).get(link + '/' + 'asggrh24353t2yt354h6533')
                .then(res => {
                    expect(res.status).toBe(404)
                })

            request(app).delete(link + '/' + 'asggrh24353t2yt354h6533')
                .then(res => {
                    expect(res.status).toBe(401)
                })

            request(app).delete(link + '/' + 'asggrh24353t2yt354h6533').set({Authorization: `${Basis}${space}${adminData}`})
                .then(res => {
                    expect(res.status).toBe(404)
                })
        })

        it('create correct Blog with POST /bogs than GET /blog/[id] and then DEL /blog[ID]', async () => {
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
                    expect(websiteUrl).toBe(blogInput.websiteUrl)
                    expect(id.startsWith('bg')).toBe(true)
                    expect(id).toEqual(expect.any(String))
                    expect(createdAt).toEqual(date)
                    return id
                })
                .then(async (id) => {
                    return [await request(app).get(link + '/' + id), id]
                })
                .then(async ([{status, body: {id: resId, name, description, websiteUrl, createdAt}}, id]) => {
                    expect(status).toBe(200)
                    expect(resId).toBe(id)
                    expect(name).toBe(blogInput.name)
                    expect(description).toBe(blogInput.description.trim())
                    expect(websiteUrl).toBe(blogInput.websiteUrl)
                    expect(id.startsWith('bg')).toBe(true)
                    expect(createdAt).toEqual(date)
                    return [await request(app).delete(link + '/' + id), id]
                })
                .then ( async ([res,id]) => {
                    expect(res.status).toBe(204)
                    return [await request(app).get(link + '/' + id), id]
                })
                .then(async ([res,id]) => {
                    expect(res.status).toBe(404)
                })
        })
    })
})
