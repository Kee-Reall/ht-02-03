import request from "supertest";
import app from "../../src/app";

describe('api/posts endpoint',()=>{

    it('should take correct structrue', async () => {

        const response = await request(app).get('api/posts')
        console.log(response)
        expect(response.status).toBe(200)

        // console.log(request)
        // request(app).get('api/posts')
        //     .then(response => {
        //         expect(response.status).toBe(200)
        //     })
    });
})