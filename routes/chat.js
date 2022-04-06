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
    getMessagesController, getRoomController, editMessageController, deleteMessageController, getMessageController
} from "../controllers/chatController.js"
import auth from "../middleware/authMiddleware.js"

const router = new Router()

// rooms routes

router.get('/myRooms', getRoomsController)
router.get('/:id/room', getRoomController)

router.post('/createRoom', createRoomController)
router.post('/joinRoom/:id', joinRoomController)

router.put('/renameRoom/:id', renameRoomController)
router.put('/updateThumb/:id', updateThumbController)

router.delete('/deleteRoom/:id', deleteRoomController)
router.delete('/leaveRoom/:id', leaveRoomController)

// messages routes

router.get('/:id/messages', getMessagesController)
router.get('/:id/message/:msgId', getMessageController)

router.post('/:id/sendMessage', sendMessageController)

router.put('/:id/editMessage/:msgId', editMessageController)

router.delete('/:id/deleteMessage/:msgId', deleteMessageController)

export default router