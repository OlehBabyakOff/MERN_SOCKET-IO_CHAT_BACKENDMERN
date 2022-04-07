import {validateRefreshToken} from "./tokenService.js"
import UserSchema from "../models/User.js";

export const getUserService = async (refreshToken) => {
    if (!refreshToken) throw new Error('Ви не авторизовані')
    const user = await validateRefreshToken(refreshToken)
    return user
}

export const getUserByIdService = async (id) => {
    if (!id) throw new Error('Дані не можуть бути порожніми')
    const user = await UserSchema.findById(id)
    return user
}
