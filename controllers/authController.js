import {
    registrationService,
    loginService,
    logoutService,
    refreshService,
    updateUserService, updateAvatarService
} from '../services/authService.js'

export const registrationController = async (req, res) => {
    try {
        const {email, username, password} = req.body
        const user = await registrationService(email, username, password)
        res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.status(201).json(user)
    } catch (e) {
        res.status(401).json(e.message)
    }
}
export const loginController = async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await loginService(username, password)
        res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.status(201).json(user)
    } catch (e) {
        res.status(401).json(e.message)
    }
}
export const logoutController = async (req, res) => {
    try {
        const {refreshToken} = req.cookies
        const token = await logoutService(refreshToken)
        res.clearCookie('refreshToken')
        return res.status(200).json(token)
    } catch (e) {
        res.status(401).json(e.message)
    }
}

export const refreshController = async (req, res) => {
    try {
        const {refreshToken} = req.cookies
        const user = await refreshService(refreshToken)
        res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.status(201).json(user)
    } catch (e) {
        res.status(400).json(e.message)
    }
}

export const updateUserController = async (req, res) => {
    try {
        const {email, username} = req.body
        const {refreshToken} = req.cookies
        const user = await updateUserService(refreshToken, email, username)
        return res.status(200).json(user)
    } catch (e) {
        res.status(400).json(e.message)
    }
}

export const updateAvatarController = async (req, res) => {
    try {
        const avatar = req.files.avatar
        const {refreshToken} = req.cookies
        const user = await updateAvatarService(refreshToken, avatar.data)
        return res.status(200).json(user)
    } catch (e) {
        res.status(400).json(e.message)
    }
}
