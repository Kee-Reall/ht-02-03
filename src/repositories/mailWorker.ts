import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {inject, injectable} from "inversify";
import {Nullable} from "../models/mixedModels";

@injectable()
export class MailWorker {
    private readonly link: string = "https://ht-02-03.vercel.app/api/auth/registration-confirmation?code="
    private readonly passLink: string = "https://ht-02-03.vercel.app/api/auth/new-password?recoveryCode="

    constructor(
        @inject(Mail<SMTPTransport.SentMessageInfo>)private mainTransporter: Mail<SMTPTransport.SentMessageInfo>
    ){}

    public async testingMessage() { // method send message, use for test SMTP server
        return await this.mainTransporter.sendMail({
            from: `it-incubator Application <${process.env.MAIL_NAME}>`,
            to: ['kirill_bezrodny@mail.ru', "smolnikov.456@mail.ru"],
            subject: 'testing',
            html: '<h1>Always on my mind<h1/><br/><h1>Always in my heart<h1/>'
        })
    }

    private message(code: string, customLink: Nullable<string> = null) {
        if(!customLink) {
            return `<h1>Thank for your registration</h1><p>To finish registration please follow the link below: <a href="${this.link}${code}">complete registration</a></p>`
        }
        return `<h1>Thank for your registration</h1><p>To finish registration please follow the link below: <a href="${customLink}/code=${code}">complete registration</a></p>`
    }

    private changePassMessage(code: string, link: Nullable<string>) {
        if (!link) {
            return `<h1>Password recovery</h1><p>To finish password recovery please follow the link below:<a href="${this.passLink}${code}">recovery password</a></p>`
        }
        return `<h1>Password recovery</h1><p>To finish password recovery please follow the link below:<a href="${link}/recoveryCode=${code}">recovery password</a></p>`
    }

    public async sendConfirmationAfterRegistration(email: string, code: string, customDomain: Nullable<string> = null): Promise<boolean> {
        try {
            const {accepted} = await this.mainTransporter.sendMail({
                from: `it-incubator Application <${process.env.MAIL_NAME}>`,
                to: email,
                subject: 'Registration conformation',
                html: this.message(code, customDomain),
            })
            return accepted.length > 0
        } catch (e) {
            return false
        }
    }

    public async changePassword(email: string, code: string,customDomain: Nullable<string> = null) {
        try {
            const {accepted} = await this.mainTransporter.sendMail({
                from: `it-incubator Application <${process.env.MAIL_NAME}>`,
                to: email,
                subject: 'Password Changing',
                html: this.changePassMessage(code, customDomain),
            })
            return accepted.length > 0
        } catch (e) {
            return false
        }
    }
}