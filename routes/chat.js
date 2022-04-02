import {Router} from "express"
import {
    createRoomController,
    getRoomsController,
    deleteRoomController,
    joinRoomController,
    leaveRoomController,
    renameRoomController,
    updateThumbController,
    sendMessageController,
    getMessagesController, getRoomController
} from "../controllers/chatController.js"
import auth from "../middleware/authMiddleware.js"

const router = new Router()

// rooms routes

router.get('/rooms', getRoomsController)
router.get('/:id/room', getRoomController)

router.post('/createRoom', createRoomController)
router.post('/joinRoom/:id', joinRoomController)

router.put('/renameRoom/:id', renameRoomController)
router.put('/updateThumb/:id', updateThumbController)

router.delete('/deleteRoom/:id', deleteRoomController)
router.delete('/leaveRoom/:id', leaveRoomController)

// messages routes

router.get('/:id/messages', getMessagesController)

router.post('/:id/sendMessage', sendMessageController)

export default router