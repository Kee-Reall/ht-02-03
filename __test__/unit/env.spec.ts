import * as dotenv from 'dotenv'

describe('environment variables:', () => { // if some of them failed check .env

    beforeAll(() => dotenv.config())

    function ValidateEmail(mail: string): boolean {
        return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    }

    it('admin login', () => {
        expect(process.env.LOGIN).not.toBe('')
        expect(process.env.LOGIN).toEqual(expect.any(String))
    })

    it('admin password', () => {
        expect(process.env.PASSWORD).not.toBe('')
        expect(process.env.PASSWORD).toEqual(expect.any(String))
    })

    it('mongo uri', () => {
        expect(process.env.MONGO_URI).not.toBe('')
        expect(process.env.MONGO_URI).toEqual(expect.any(String))
        expect(process.env.MONGO_URI!.startsWith('mongodb')).toBe(true) //does not check correcting URL
    })

    it('JWT secret', () => { // ATTENTION it checks existing of jwt-secret, not the correct value
        expect(process.env.JWT_SECRET).not.toBe('')
        expect(process.env.JWT_SECRET).toEqual(expect.any(String))
    })

    it('mail login', () => {
        expect(process.env.MAIL_NAME).not.toBe('')
        expect(process.env.MAIL_NAME).toEqual(expect.any(String))
        expect(ValidateEmail(process.env.MAIL_NAME as string)).toBe(true)
    })

    it('mail password', () => {
        expect(process.env.MAIL_PASSWORD).not.toBe('')
        expect(process.env.MAIL_PASSWORD).toEqual(expect.any(String))
    })
})