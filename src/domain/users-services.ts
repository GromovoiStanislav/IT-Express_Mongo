import {UserDBType, Users} from "../repositories/users";
import { refreshTokens} from "../repositories/refreshTokens";
import {UserInputModel, UsersViewModel, UserViewModel} from "../types/users";
import bcryptjs from 'bcryptjs'
import {paginationParams} from '../middlewares/input-validation'
import {jwtService} from "../aplicarion/jwt-service";
import {emailAdapter} from "../adapters/email-adapter";
import {settings} from '../settigs'
import {v4 as uuidv4} from 'uuid'



export const UsersService = {

    async clearAll(): Promise<void> {
        await Users.clearAll()
        await refreshTokens.clearAll()
    },

    async deleteByID(id: string): Promise<Boolean> {
        return await Users.deleteByID(id)
    },


    async registerUser(dataUser: UserInputModel): Promise<Boolean> {
        const subject = 'Thank for your registration'
        const confirmation_code = uuidv4()
        const message = `
        <div>
           <h1>Thank for your registration</h1>
           <p>To finish registration please follow the link below:
              <a href='${settings.URL}/auth/registration-confirmation?code=${confirmation_code}'>complete registration</a>
          </p>
        </div>`

        const isEmailSended = await emailAdapter.sendEmail(dataUser.email, subject, message)
        if (isEmailSended) {
            const newUser: UserDBType = {
                login: dataUser.login,
                email: dataUser.email,
                password: await this._generateHash(dataUser.password),
                id: uuidv4(),
                createdAt: new Date().toISOString(),
                emailConfirmation: {
                    confirmationCode: confirmation_code,
                    isConfirmed: false,
                }
            }
            await Users.createNewUser({...newUser})
            return true
        }
        return false
    },

    async confirmEmail(confirmationCode: string): Promise<Boolean> {

        const user = await Users.getUserByConfirmationCode(confirmationCode)
        if (!user) {
            return false
        }
        if (user.emailConfirmation?.isConfirmed) {
            return false
        }

        await Users.confirmUser(user.id)
        return true
    },


    async resendConfirmationCode(email: string): Promise<Boolean> {
        const user = await Users.getUserByEmail(email)
        if (!user) {
            return false
        }
        if (user.emailConfirmation?.isConfirmed) {
            return false
        }

        const subject = 'Thank for your registration'
        const confirmation_code = uuidv4()
        const message = `<a href='${settings.URL}/auth/registration-confirmation?code=${confirmation_code}'>complete registration</a>`

        const isEmailSended = await emailAdapter.sendEmail(user.email, subject, message)
        if (isEmailSended) {
            await Users.updateConfirmCode(user.id, confirmation_code)
            return true
        }
        return false
    },


/////////////////////////////////////////////////////////


    async createNewUser(dataUser: UserInputModel): Promise<UserViewModel> {

        const newUser: UserDBType = {
            login: dataUser.login,
            email: dataUser.email,
            password: await this._generateHash(dataUser.password),
            id: uuidv4(),
            createdAt: new Date().toISOString(),
        }

        await Users.createNewUser({...newUser})

        return {
            login: newUser.login,
            email: newUser.email,
            id: newUser.id,
            createdAt: newUser.createdAt,
        }
    },


    async findUserById(userID: string): Promise<UserDBType | null> {
        return await Users.getUserById(userID)

    },

    async loginUser(login: string, password: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        const user = await Users.getUserByLogin(login)
        if (user) {
            const compareOK = await this._comparePassword(password, user.password)
            if (compareOK) {
                return {
                    accessToken: await jwtService.createJWT(user.id, '10s'),
                    refreshToken: await jwtService.createJWT(user.id, '20s'),
                }
            }
        }
        return null
    },

    async refreshTokens(refreshToken: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        if (!refreshToken) {
            return null
        }
        if(await refreshTokens.findToken(refreshToken)) {
            return null
        }
        const userId = await jwtService.getUserIdByToken(refreshToken)
        if (userId) {
                await refreshTokens.addNewToken(refreshToken)
                return {
                    accessToken: await jwtService.createJWT(userId, '10s'),
                    refreshToken: await jwtService.createJWT(userId, '20s'),
                }
        }
        return null
    },


    async logoutUser(refreshToken: string): Promise<boolean> {
        if (!refreshToken) {
            return false
        }
        if(await refreshTokens.findToken(refreshToken)) {
            return false
        }
        if (!await jwtService.getUserIdByToken(refreshToken)) {
            return false
        }
        await refreshTokens.addNewToken(refreshToken)
        return true
    },


    async _generateHash(password: string): Promise<string> {
        return await bcryptjs.hash(password, 10)
    },

    async _comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcryptjs.compare(password, hash)
    }


}

export const UsersQuery = {

    async getAll(searchLoginTerm: string, searchEmailTerm: string, paginationParams: paginationParams): Promise<UsersViewModel> {

        const result = await Users.getAll(searchLoginTerm, searchEmailTerm, paginationParams)

        //На всякий случай
        result.items = result.items.map(el => ({
            id: el.id,
            login: el.login,
            email: el.email,
            createdAt: el.createdAt,
        }))

        return result
    },

}

