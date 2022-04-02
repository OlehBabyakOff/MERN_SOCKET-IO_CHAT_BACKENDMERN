import mongoose from "mongoose"
const {model, Schema} = mongoose

const MessageSchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    text: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

export default model('Message', MessageSchema)