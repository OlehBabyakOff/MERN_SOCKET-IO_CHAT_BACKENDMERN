import {Router} from "express"
import {
    createRoomController,
    getMyRoomsController,
    deleteRoomController,
    joinRoomController,
    leaveRoomController,
    renameRoomController,
    updateThumbController,
    sendMessageController,
    getMessagesController,
    getRoomController,
    editMessageController,
    deleteMessageController,
    getMessageController,
    getRoomsController, kickUserController
} from "../controllers/chatController.js"
import auth from "../middleware/authMiddleware.js"

const router = new Router()

// rooms routes

router.get('/myRooms', getMyRoomsController)
router.get('/rooms', getRoomsController)
router.get('/:id/room', getRoomController)

router.post('/createRoom', createRoomController)
router.post('/joinRoom/:id', joinRoomController)

router.put('/renameRoom/:id', renameRoomController)
router.put('/updateThumb/:id', updateThumbController)

router.delete('/deleteRoom/:id', deleteRoomController)
router.delete('/leaveRoom/:id', leaveRoomController)
router.delete('/kickUser/:id/:userId', kickUserController)

// messages routes

router.get('/:id/messages', getMessagesController)
router.get('/:id/message/:msgId', getMessageController)

router.post('/:id/sendMessage', sendMessageController)

router.put('/:id/editMessage/:msgId', editMessageController)

router.delete('/:id/deleteMessage/:msgId', deleteMessageController)

export default router