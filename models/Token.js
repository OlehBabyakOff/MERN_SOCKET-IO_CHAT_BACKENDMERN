import mongoose from "mongoose"
const {model, Schema} = mongoose

const TokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    refreshToken: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

export default model('Token', TokenSchema)