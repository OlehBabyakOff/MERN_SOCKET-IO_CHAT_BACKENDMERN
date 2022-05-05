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

    const checkMember = await room.members.find(member => member.id === user.id)
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

    const checkMember = await room.members.find(member => member.id === user.id)
    if (!checkMember) throw new Error(`Ви не являєтесь учасником кімнати ${room.roomName}`)

    const updatedRoom = await RoomSchema.findOneAndUpdate({_id: roomId}, {
        $pullAll: {
            members: [{_id: user.id}]
        }
    })

    return updatedRoom
}

export const kickUserService = async (roomId, userId) => {
    if (!roomId) throw new Error('Кімнату не знайдено')
    if (!userId) throw new Error('Користувача не знайдено')

    const user = await UserSchema.findById(userId)
    if (!user) throw new Error('Користувача не знайдено')

    const room = await RoomSchema.findById(roomId)
    if (!room) throw new Error('Кімнати не існує')

    const checkMember = await room.members.find(member => member.id === user.id)
    if (!checkMember) throw new Error(`Користувач не являєтесь учасником кімнати ${room.roomName}`)

    const updatedRoom = await RoomSchema.updateOne({_id: roomId}, {
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

    const updatedRoom = await RoomSchema.updateOne({_id: roomId}, {
        roomName
    })

    return updatedRoom
}

export const updateThumbService = async (thumb, roomId) => {
    if (!thumb && !roomId) throw new Error('Введіть дані')

    const room = await RoomSchema.findById(roomId)
    if (!room) throw new Error('Кімнати не існує')

    const updatedRoom = await RoomSchema.updateOne({_id: roomId}, {
        thumb
    })

    return updatedRoom
}

export const deleteRoomService = async (id, refreshToken) => {
    if (!refreshToken) throw new Error('Ви не авторизовані')
    if (!id) throw new Error('Введіть дані')

    const userData = await validateRefreshToken(refreshToken)
    if (!userData) throw new Error('Користувача не знайдено')

    const room = await RoomSchema.findOne({_id: id})

    if (room.admin.toString() !== userData.id) throw new Error('Ви не можете видалити чат, де ви не є адміністратором')

    const deleteRoom = await RoomSchema.findOneAndDelete({_id: id})

    return deleteRoom
}

export const getMyRoomsService = async (refreshToken) => {
    if (!refreshToken) throw new Error('Ви не авторизовані')

    const userData = await validateRefreshToken(refreshToken)
    if (!userData) throw new Error('Користувача не знайдено')

    const rooms = await RoomSchema.find()
    const memberRooms = []

    rooms.forEach(room => {
        const res = room.members.filter(user => user.id === userData.id)
        if (res.length > 0) memberRooms.push(room)
    })
    return memberRooms
}

export const getRoomsService = async () => {
    const rooms = await RoomSchema.find()
    return rooms
}

export const getRoomService = async (id) => {
    const room = await RoomSchema.findById(id)
    // let users = []
    // for (const member of room.members) {
    //     users = [...users, await UserSchema.find({_id: member._id})]
    // }
    //
    // return {
    //     room,
    //     users
    // }

    return room
}

// messages services

export const sendMessageService = async (refreshToken, roomId, text, image) => {
    if (!refreshToken) throw new Error('Токен не існує')
    if (!roomId) throw new Error('Кімнати не існує')
    if (!text && !image) throw new Error('Дані не можуть бути порожні')

    const {id} = await validateRefreshToken(refreshToken)
    if (!id) throw new Error('Помилка авторизації')

    const message = await MessageSchema.create({room: roomId, user: id, text, createdAt: new Date()})
    if (image) {
        await MessageSchema.updateOne({_id: message._id}, {
            image: image.data
        })
    }
    return message
}

export const editMessageService = async (roomId, messageId, refreshToken, text) => {
    if (!refreshToken) throw new Error('Токен не існує')
    if (!roomId && !messageId && !text) throw new Error('Дані не можуть бути порожні')

    const {id} = await validateRefreshToken(refreshToken)
    if (!id) throw new Error('Помилка авторизації')

    const message = await MessageSchema.findOne({_id: messageId, room: roomId})
    if (!message) throw new Error('Повідомлення не знайдено')

    if (message.user.toString() !== id) throw new Error('Ви не можете редагувати чуже повідомлення')

    const editMessage = await MessageSchema.updateOne({_id: messageId, room: roomId, user: id}, {
        text
    })

    return editMessage
}

export const deleteMessageService = async (roomId, messageId, refreshToken) => {
    if (!refreshToken) throw new Error('Токен не існує')
    if (!roomId && !messageId) throw new Error('Дані не можуть бути порожні')

    const {id} = await validateRefreshToken(refreshToken)
    if (!id) throw new Error('Помилка авторизації')

    const message = await MessageSchema.findOne({_id: messageId, room: roomId})
    if (!message) throw new Error('Повідомлення не знайдено')

    if (message.user.toString() !== id) throw new Error('Ви не можете видалити чуже повідомлення')

    const deleteMessage = await MessageSchema.deleteOne({_id: messageId, room: roomId, user: id})

    return deleteMessage
}

export const getMessagesService = async (roomId) => {
    if (!roomId) throw new Error('Дані не можуть бути порожні')

    const messages = await MessageSchema.find({room: roomId})
    return messages
}

export const getMessageService = async (roomId, messageId) => {
    if (!roomId && !messageId) throw new Error('Дані не можуть бути порожні')

    const message = await MessageSchema.findOne({_id: messageId, room: roomId})
    return message
}