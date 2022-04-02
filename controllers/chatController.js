import {
    createRoomService,
    getRoomsService,
    deleteRoomService,
    joinRoomService,
    leaveRoomService,
    renameRoomService, updateThumbService, sendMessageService, getMessagesService, getRoomService
} from "../services/chatService.js"
import {validateRefreshToken} from "../services/tokenService.js"

// rooms controllers

export const createRoomController = async (req, res) => {
    try {
        const {roomName} = req.body
        const {refreshToken} = req.cookies
        const author = await validateRefreshToken(refreshToken)
        if (!author) throw new Error('Ви не авторизовані')
        const room = await createRoomService(author.id, roomName)
        return res.status(200).json(room)
    } catch (e) {
        res.status(400).json(e.message)
    }
}

export const joinRoomController = async (req, res) => {
    try {
        const {id} = req.params
        const {refreshToken} = req.cookies
        const member = await joinRoomService(id, refreshToken)
        return res.status(200).json(member)
    } catch (e) {
        res.status(400).json(e.message)
    }
}

export const leaveRoomController = async (req, res) => {
    try {
        const {id} = req.params
        const {refreshToken} = req.cookies
        const member = await leaveRoomService(id, refreshToken)
        return res.status(200).json(member)
    } catch (e) {
        res.status(400).json(e.message)
    }
}

export const renameRoomController = async (req, res) => {
    try {
        const {roomName} = req.body
        const {id} = req.params
        const room = await renameRoomService(roomName, id)
        return res.status(200).json(room)
    } catch (e) {
        res.status(400).json(e.message)
    }
}

export const updateThumbController = async (req, res) => {
    try {
        const {id} = req.params
        const thumb = req.files.thumb
        const room = await updateThumbService(thumb.data, id)
        return res.status(200).json(room)
    } catch (e) {
        res.status(400).json(e.message)
    }
}

export const deleteRoomController = async (req, res) => {
    try {
        const {id} = req.params
        await deleteRoomService(id)
        return res.status(200).json('Кімнату видалено')
    } catch (e) {
        res.status(400).json(e.message)
    }
}

export const getRoomsController = async (req, res) => {
    try {
        const rooms = await getRoomsService()
        res.status(200).json(rooms)
    } catch (e) {
        res.status(400).json(e.message)
    }
}

export const getRoomController = async (req, res) => {
    try {
        const {id} = req.params
        const room = await getRoomService(id)
        res.status(200).json(room)
    } catch (e) {
        res.status(400).json(e.message)
    }
}

// messages controllers

export const sendMessageController = async (req, res) => {
    try {
        const {refreshToken} = req.cookies
        const {id} = req.params
        const {text} = req.body
        const message = await sendMessageService(refreshToken, id, text)
        return res.status(200).json(message)
    } catch (e) {
        res.status(400).json(e.message)
    }
}

export const getMessagesController = async (req, res) => {
    try {
        const {id} = req.params
        const messages = await getMessagesService(id)
        return res.status(200).json(messages)
    } catch (e) {
        res.status(400).json(e.message)
    }
}