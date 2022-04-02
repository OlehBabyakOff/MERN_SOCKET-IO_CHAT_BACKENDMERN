import RoomSchema from "../models/Room.js"
import UserSchema from "../models/User.js";
import MessageSchema from "../models/Message.js";
import {validateRefreshToken} from "./tokenService.js";

// rooms services

export const createRoomService = async (admin, roomName) => {
    if (!roomName && !admin) throw new Error('Введіть дані')

    const candidate = await RoomSchema.findOne({roomName})
    if (candidate) throw new Error('Назва чату вже використовується')

    const user = await UserSchema.findById(admin)
    if (!user) throw new Error('Користувача не знайдено')

    const room = await RoomSchema.create({admin, roomName, members: user})
    return room
}

export const joinRoomService = async (roomId, refreshToken) => {
    if (!roomId) throw new Error('Кімнату не знайдено')
    if (!refreshToken) throw new Error('Ви не авторизовані')

    const user = await validateRefreshToken(refreshToken)
    if (!user) throw new Error('Користувача не знайдено')

    const room = await RoomSchema.findById(roomId)
    if (!room) throw new Error('Кімнати не існує')

    const checkMember = room.members.find(member => member.id === user.id)
    if (checkMember) throw new Error(`Ви вже являєтесь учасником кімнати ${room.roomName}`)

    room.members.push(user.id)
    await room.save()
    return room
}

export const leaveRoomService = async (roomId, refreshToken) => {
    if (!roomId) throw new Error('Кімнату не знайдено')
    if (!refreshToken) throw new Error('Ви не авторизовані')

    const user = await validateRefreshToken(refreshToken)
    if (!user) throw new Error('Користувача не знайдено')

    const room = await RoomSchema.findById(roomId)
    if (!room) throw new Error('Кімнати не існує')

    const checkMember = room.members.find(member => member.id === user.id)
    if (!checkMember) throw new Error(`Ви не являєтесь учасником кімнати ${room.roomName}`)

    const updatedRoom = await RoomSchema.updateOne({roomId}, {
        $pullAll: {
            members: [{_id: user.id}]
        }
    })

    return updatedRoom
}

export const renameRoomService = async (roomName, roomId) => {
    if (!roomName && !roomId) throw new Error('Введіть дані')

    const room = await RoomSchema.findById(roomId)
    if (!room) throw new Error('Кімнати не існує')

    const updatedRoom = await RoomSchema.updateOne({roomId}, {
        roomName
    })

    return updatedRoom
}

export const updateThumbService = async (thumb, roomId) => {
    if (!thumb && !roomId) throw new Error('Введіть дані')

    const room = await RoomSchema.findById(roomId)
    if (!room) throw new Error('Кімнати не існує')

    const updatedRoom = await RoomSchema.updateOne({roomId}, {
        thumb
    })

    return updatedRoom
}

export const deleteRoomService = async (id) => {
    if (!id) throw new Error('Введіть дані')
    const room = await RoomSchema.findOneAndDelete({_id: id})
    return room
}

export const getRoomsService = async () => {
    const rooms = await RoomSchema.find()
    return rooms
}

export const getRoomService = async (id) => {
    const room = await RoomSchema.findById(id)
    return room
}

// messages services

export const sendMessageService = async (refreshToken, roomId, text) => {
    if (!refreshToken) throw new Error('Токен не існує')
    if (!roomId && !text) throw new Error('Дані не можуть бути порожні')

    const {id} = await validateRefreshToken(refreshToken)
    if (!id) throw new Error('Помилка авторизації')

    const message = await MessageSchema.create({room: roomId, user: id, text, createdAt: new Date()})
    return message
}

export const getMessagesService = async (roomId) => {
    if (!roomId) throw new Error('Дані не можуть бути порожні')

    const messages = await MessageSchema.find({room: roomId})
    return messages
}