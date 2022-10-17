import 'dotenv/config'

export const settings = {
    JWT_SECRET: process.env.JWT_SECRET || 'very secret key',
    URL: process.env.URL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL: process.env.EMAIL,
}