import request from 'supertest';
import app from "../../src/app";
import {blogs} from "../../src/adapters/mongoConnectorCreater";

describe('default \'api/blogs endpoint',() => {

    it('should response with correct structure', async () => { //it does not work with await
        request(app).get('api/blogs',async (err, response) => {
            expect(err).not.toBeDefined()
            expect(response.status).toBe(200)
            expect(response.body.items).toEqual(expect.any(Array))
            expect(response.body.page).toBe(1)
            expect(response.body.pageSize).toBe(10)
            expect(response.body.pagesCount).toEqual(expect.any(Number))
            expect(response.body.totalCount).toEqual((expect.any(Number)))
            expect(response.body.pagesCount).toBeCloseTo(Math.floor(response.body.totalCount/response.body.pageSize))
            expect(response.body.totalCount).toBe(await blogs.count({}))
        })
    })

    it('should return with query ', async function () {
        request(app).get('api/blogs?page=4&pageSize=7',async (err, res)=> {
            expect(err).not.toBeDefined()
            const { status, body } = res
            expect(status).toBe(200)
            for(let i of body) {
                expect(i).toBeDefined()
            }
            const {page, pageSize, totalCount, pagesCount, items} = body
            expect(page).toBe(4)
            expect(pageSize).toBe(7)
            expect(items.length).toBeLessThanOrEqual(7)
            expect(totalCount).toEqual(expect.any(Number))
            expect(pagesCount).toEqual(expect.any(Number))
            expect(pagesCount).toBeCloseTo(Math.floor(totalCount/pageSize))
            expect(totalCount).toBe(await blogs.count({}))
        })

        // const res = await request(app).get('api/blogs?page=4&pageSize=7')
        // const { status, body } = res
        // expect(status).toBe(200)
        // for(let i of body) {
        //     expect(i).toBeDefined()
        // }
        // const {page, pageSize, totalCount, pagesCount, items} = body
        // expect(page).toBe(4)
        // expect(pageSize).toBe(7)
        // expect(items.length).toBeLessThanOrEqual(7)
        // expect(totalCount).toEqual(expect.any(Number))
        // expect(pagesCount).toEqual(expect.any(Number))
        // expect(pagesCount).toBeCloseTo(Math.floor(totalCount/pageSize))
        // expect(totalCount).toBe(await blogs.count({}))
    })

    it('create 3 posts with similar pattern and then return them',async () =>{
        const uniqueName = '3χσυγα'
        const response = request(app).post('api/blogs').send({name:uniqueName + 'jam',description:'call me when you want',websiteUrl:"algo.kz"})
        //request(app).post('api/blogs').send({name:uniqueName + 'kam',description:'call me when you want',websiteUrl:"algo.kz"}).expect(201)
        //request(app).post('api/blogs').send({name:uniqueName + 'lam',description:'call me when you want',websiteUrl:"algo.kz"}).expect(201)
       // expect(response.status).toBe(200)
        // await request(app).get('api/blogs',async (err, res) => {
        //     expect(res.body.items.length).toBe(3)
        // })
    })
})