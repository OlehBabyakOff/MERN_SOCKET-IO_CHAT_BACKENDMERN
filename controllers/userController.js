import {getUserService} from "../services/userService.js"

export const getUserController = async (req, res) => {
    try {
        const {refreshToken} = req.cookies
        const user = await getUserService(refreshToken)
        return res.status(201).json(user)
    } catch (e) {
        res.status(401).json(e.message)
    }
}

