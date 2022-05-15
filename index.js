import express from 'express'
import * as http from "http"
import {Server} from "socket.io"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from 'cors'
import fileUpload from 'express-fileupload'
import 'dotenv/config'

import authRouter from './routes/auth.js'
import chatRouter from './routes/chat.js'

const app = express()

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(fileUpload())
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/api', authRouter, chatRouter)

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`)

    socket.on('joinRoom', data => {
        const [room, user] = data
        socket.join(room)
        io.emit('online', data)
        console.log(`User ${user} joined room ${room}`)
    })

    socket.on('sendMessage', data => {
        socket.broadcast.to(data.room).emit('receiveMessage', data)
    })

    socket.on('sendLocation', data => {
        socket.broadcast.to(data.room).emit('locationMessage', data)
    })

    socket.on('leaveRoom', data => {
        const [room, user] = data
        socket.leave(room)
        io.emit('offline', data)
        console.log(`User ${user} left room ${room}`)
    })

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`)
    })
})

const start = async () => {
    await mongoose.connect(process.env.MONGO_URL,
        {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log(`Connected to DB`))
        .then(() => server.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`)))
        .catch(e => console.log(e))
}

start()