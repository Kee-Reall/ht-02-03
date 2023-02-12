import {createTransport} from 'nodemailer'

export const mailAdapter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_NAME,
        pass: process.env.MAIL_PASSWORD
    }
})
