import {validateRefreshToken} from "./tokenService.js"
import UserSchema from "../models/User.js";

export const getUserService = async (refreshToken) => {
    if (!refreshToken) throw new Error('Ви не авторизовані')
    const {id} = await validateRefreshToken(refreshToken)

    const user = await UserSchema.findById(id)
    return user
}

export const getUsersService = async () => {
    const users = await UserSchema.find()
    return users
}

export const getUserByIdService = async (id) => {
    if (!id) throw new Error('Дані не можуть бути порожніми')
    const user = await UserSchema.findById(id)
    return user
}
