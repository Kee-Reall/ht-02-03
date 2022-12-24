import {Request} from "express";
export const basicAuthHelper = (req: Request): boolean => {
    const auth = req.headers.authorization?.split(' ')
    if (!Array.isArray(auth)) {
        return false
    }
    const [type, auth64] = auth
    const [login, password] = Buffer.from(auth64 ?? '', 'base64').toString('ascii').split(':')
    const [adminLogin, adminPassword] = [process.env.LOGIN, process.env.PASSWORD]
    return login === adminLogin && password === adminPassword && type === 'Basic'
}