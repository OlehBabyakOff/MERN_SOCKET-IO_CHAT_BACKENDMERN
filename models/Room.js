import mongoose from "mongoose"
const {model, Schema} = mongoose

const RoomSchema = new Schema({
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    roomName: {
        type: String,
        unique: true,
        require: true
    },
    thumb: {
        type: Buffer
    },
    members: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    createdAt: {
        type: Date,
        default: new Date()
    }
})

export default model('Room', RoomSchema)