import {validateRefreshToken} from "./tokenService.js"

export const getUserService = async (refreshToken) => {
    if (!refreshToken) throw new Error('Ви не авторизовані')
    const user = await validateRefreshToken(refreshToken)
    return user
}
