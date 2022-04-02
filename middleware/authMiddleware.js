import {validateAccessToken} from "../services/tokenService.js"

export default async function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return next(res.status(401).json('Ви не авторизовані'))

        const accessToken = authHeader.split(' ')[1]
        if (!accessToken) return next(res.status(401).json('Ви не авторизовані'))

        const userData = await validateAccessToken(accessToken)
        if (!userData) return next(res.status(401).json('Ви не авторизовані'))

        req.user = userData
        next()
    } catch (e) {
        return next(res.status(401).json('Ви не авторизовані'))
    }
}