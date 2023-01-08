import {mailAdapter} from "../adapters/mailAdapter";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
class MailWorker {
    constructor(
        private mainTransporter: Mail<SMTPTransport.SentMessageInfo> = mailAdapter
    ) {}
    public async testingMessage() {
        return await this.mainTransporter.sendMail({
            from:`it-incubator Application <${process.env.MAIL_NAME}>`,
            to: ['kirill_bezrodny@mail.ru',"smolnikov.456@mail.ru","sauda@saf","alizast18@gmail.com"],
            subject: 'testing',
            html: '<h1>Always on my mind<h1/><br/><h1>Always in my heart<h1/>'
        })
    }
}
export const mailWorker = new MailWorker()