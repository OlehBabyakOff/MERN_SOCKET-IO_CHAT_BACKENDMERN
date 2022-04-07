import {Router} from "express"
import {
    registrationController,
    loginController,
    logoutController,
    refreshController, updateUserController, updateAvatarController
} from "../controllers/authController.js";
import {getUserByIdController, getUserController} from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";

const router = new Router()

router.get('/me', auth, getUserController)
router.get('/user/:id', getUserByIdController)
router.get('/refresh', refreshController)

router.post('/registration', registrationController)
router.post('/login', loginController)
router.post('/logout', logoutController)

router.put('/update', updateUserController)
router.put('/updateAvatar', updateAvatarController)

export default router