import express from 'express';
import { registerController, loginController, logoutController , getUserController} from '../controllers/authController.js';
import { requiredSignIn } from '../middlewares/authMiddleware.js'


const router = express.Router();

router.post('/register', registerController)

router.post('/login', loginController)

router.post('/logout', logoutController)

router.get('/user',requiredSignIn, getUserController)



export default router