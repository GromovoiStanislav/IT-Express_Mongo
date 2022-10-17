import nodemailer from 'nodemailer'
import {settings} from '../settigs'

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string):Promise<boolean> {

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: settings.EMAIL,
                pass: settings.EMAIL_PASSWORD
            }
        })

        try {
            await transport.sendMail({
                from: `Stas <${settings.EMAIL}>`,
                to: email,
                subject: subject,
                html: message,
            })
            return  true
        } catch (e) {
            console.log(e)
            return  false
        }
    }
}
