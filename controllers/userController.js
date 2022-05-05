import {getUserByIdService, getUserService, getUsersService} from "../services/userService.js"

export const getUserController = async (req, res) => {
    try {
        const {refreshToken} = req.cookies
        const user = await getUserService(refreshToken)
        return res.status(201).json(user)
    } catch (e) {
        res.status(401).json(e.message)
    }
}

export const getUsersController = async (req, res) => {
    try {
        const users = await getUsersService()
        return res.status(201).json(users)
    } catch (e) {
        res.status(401).json(e.message)
    }
}

export const getUserByIdController = async (req, res) => {
    try {
        const {id} = req.params
        const user = await getUserByIdService(id)
        return res.status(200).json(user)
    } catch (e) {
        res.status(401).json(e.message)
    }
}
