import 'dotenv/config'
import nodemailer from 'nodemailer'

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string):Promise<boolean> {

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        try {
            await transport.sendMail({
                from: `Stas <${process.env.EMAIL}>`,
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
