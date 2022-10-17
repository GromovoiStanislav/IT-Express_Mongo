import 'dotenv/config'

export const settings = {
    JWT_SECRET: process.env.JWT_SECRET || 'very secret key',
    URL: process.env.URL,
}