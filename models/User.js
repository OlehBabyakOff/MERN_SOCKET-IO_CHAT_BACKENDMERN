import mongoose from "mongoose"
const {model, Schema} = mongoose

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        require: true
    },
    username: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    avatar: {
        data: Buffer,
        contentType: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

export default model('User', UserSchema)