import { Router } from "express";
import signupController from "../controllers/user/signup/signupController.js"
import loginController from "../controllers/user/login/loginController.js"
import userAuthentication from "../middlewares/auth.js"
import upload from "../middlewares/multer.js";
const router = Router();

router.post('/signup', upload.single('profilePicture'), signupController)
router.post('/login', loginController)

export default router;