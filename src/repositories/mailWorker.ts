import {mailAdapter} from "../adapters/mailAdapter";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
class MailWorker {
    private readonly link: string = "https://ht-02-03.vercel.app/api/auth/registration-confirmation?code="
    //private readonly localLink: string = "http://localhost:3000/api/auth/registration-confirmation?code="
    constructor(
        private mainTransporter: Mail<SMTPTransport.SentMessageInfo> = mailAdapter
    ) {}
    public async testingMessage() {
        return await this.mainTransporter.sendMail({
            from:`it-incubator Application <${process.env.MAIL_NAME}>`,
            to: ['kirill_bezrodny@mail.ru',"smolnikov.456@mail.ru"],
            subject: 'testing',
            html: '<h1>Always on my mind<h1/><br/><h1>Always in my heart<h1/>'
        })
    }

    private message(code: any) {
        return `<h1>Thank for your registration</h1><p>To finish registration please follow the link below:<a href="${this.link}${code}">complete registration</a></p>`
    }

    public async sendConfirmationAfterRegistration(email: string,code: any): Promise<boolean> {
        try {
            const {accepted} = await this.mainTransporter.sendMail({
                from: `it-incubator Application <${process.env.MAIL_NAME}>`,
                to: email,
                subject: 'Registration conformation',
                html: this.message(code),
            })
            return accepted.length > 0
        } catch (e) {
            return false
        }
    }
}
export const mailWorker = new MailWorker()