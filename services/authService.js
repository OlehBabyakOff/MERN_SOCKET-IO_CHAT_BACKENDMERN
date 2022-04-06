import UserSchema from "../models/User.js"
import bcrypt from 'bcrypt'

import {generateToken, saveToken, removeToken, validateRefreshToken, findToken} from './tokenService.js'
import User from "../models/User.js";

export const registrationService = async (email, username, password) => {
    if (!email && !username && !password) throw new Error('Дані не можуть бути порожніми')

    const emailExist = await UserSchema.findOne({email})
    if (emailExist) throw new Error('Пошта вже зареєстрована')
    const usernameExist = await UserSchema.findOne({username})
    if (usernameExist) throw new Error('Дане ім\`я вже зареєстроване')

    const hashPassword = await bcrypt.hash(password, 6)
    const user = await UserSchema.create({email, username, password: hashPassword})

    const userData = {
        id: user._id,
        email: user.email,
        username
    }

    const tokens = await generateToken(userData)
    await saveToken(user.id, tokens.refreshToken)

    return {
        ...tokens,
        user: userData
    }
}

export const loginService = async (username, password) => {
    if (!username && !password) throw new Error('Дані не можуть бути порожніми')

    const user = await UserSchema.findOne({username})
    if (!user) throw new Error('Користувача не знайдено')

    const comparePass = await bcrypt.compare(password, user.password)
    if (!comparePass) throw new Error('Невірний пароль')

    const userData = {
        id: user._id,
        email: user.email,
        username
    }

    const tokens = await generateToken(userData)
    await saveToken(user.id, tokens.refreshToken)

    return {
        ...tokens,
        user: userData
    }
}

export const logoutService = async (refreshToken) => {
    const token = await removeToken(refreshToken)
    return token
}

export const refreshService = async (refreshToken) => {
    if (!refreshToken) throw new Error('Токен не існує')
    const userData = await validateRefreshToken(refreshToken)
    const tokenDB = await findToken(refreshToken)
    if (!userData || !tokenDB) throw new Error('Помилка авторизації')
    const user = await UserSchema.findOne({_id: userData.id})
    const userHash = {
        id: user._id,
        email: user.email,
        username: user.username
    }

    const tokens = await generateToken(userHash)
    await saveToken(user.id, tokens.refreshToken)

    return {
        ...tokens,
        user: userHash
    }
}

export const updateUserService = async (refreshToken, email, username) => {
    if (!refreshToken) throw new Error('Токен не існує')
    const {id} = await validateRefreshToken(refreshToken)
    if (!id) throw new Error('Помилка авторизації')

    const updatedUser = await UserSchema.updateOne({id}, {
        email,
        username
    })

    return updatedUser
}

export const updateAvatarService = async (refreshToken, avatar) => {
    if (!refreshToken) throw new Error('Токен не існує')
    if (!avatar) throw new Error('Дані не можуть бути порожні')
    const {id} = await validateRefreshToken(refreshToken)
    if (!id) throw new Error('Помилка авторизації')

    const updatedUser = await UserSchema.updateOne({id}, {
        avatar
    })

    return updatedUser
}
