import {UserDBType, Users} from "../repositories/users";
import {refreshTokens} from "../repositories/refreshTokens";
import {UserInputModel, UsersViewModel, UserViewModel} from "../types/users";
import bcryptjs from 'bcryptjs'
import {paginationParams} from '../middlewares/input-validation'
import {jwtService} from "../aplication/jwt-service";
import {emailAdapter} from "../adapters/email-adapter";
import {settings} from '../settigs'
import {v4 as uuidv4} from 'uuid'


export const UsersService = {

    /////////////////////////////////
    async clearAll(): Promise<void> {
        await Users.clearAll()
        await refreshTokens.clearAll()
    },


    //////////////////////////////////////////
    async deleteByID(id: string): Promise<Boolean> {
        return await Users.deleteByID(id)
    },


    ////////////////////////////////////////////////
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


    /////////////////////////////////////
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

    ///////////////////////////////////////////
    async passwordRecovery(email: string): Promise<void> {

        const subject = 'Password recovery'
        const recoveryCode = uuidv4()
        const message = `<a href='${settings.URL}/auth/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>`

        await emailAdapter.sendEmail(email, subject, message);
        await Users.updateRecoveryCodeByEmail(email,recoveryCode)
    },


    ///////////////////////////////////////////
    async newPassword(recoveryCode: string, newPassword: string): Promise<Boolean> {
        const hash = await this._generateHash(newPassword)
        await Users.confirmRecoveryPassword(recoveryCode,hash)
        return true
    },


    ////////////////////////////////////////
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


    //////////////////////////////////////////
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


    //////////////////////////////////
    async loginUser(login: string, password: string, ip: string, title: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        const user = await Users.getUserByLogin(login)
        if (user) {
            const compareOK = await this._comparePassword(password, user.password)
            if (compareOK) {
                const deviceId = uuidv4() // т.е. это Сессия
                return {
                    accessToken: await jwtService.createAuthJWT(user.id),
                    refreshToken: await jwtService.createRefreshJWT(user.id, deviceId, ip, title)
                }
            }
        }
        return null
    },


    /////////////////////////////////////////////
    async refreshToken(refreshToken: string, ip: string, title: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        if (!refreshToken) {
            return null
        }

        const result = await jwtService.getInfoByToken(refreshToken)
        if (result) {
            return {
                accessToken: await jwtService.createAuthJWT(result.userId),
                refreshToken: await jwtService.createRefreshJWT(result.userId, result.deviceId, ip, title),
            }
        }

        return null
    },


    //////////////////////////////////////////
    async logoutUser(refreshToken: string): Promise<Boolean> {
        if (!refreshToken) {
            return false
        }
        return jwtService.killSessionByToken(refreshToken)

    },


    ///////////////////////////////////////////////
    async _generateHash(password: string): Promise<string> {
        return await bcryptjs.hash(password, 10)
    },


    ////////////////////////////////////////////
    async _comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcryptjs.compare(password, hash)
    }


}

export const UsersQuery = {

    ////////////////////////////////
    async findUserById(userID: string): Promise<UserDBType | null> {
        return await Users.getUserById(userID)

    },

    ////////////////////////////////
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

