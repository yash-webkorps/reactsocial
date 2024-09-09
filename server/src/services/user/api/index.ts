import { Router } from "express"
import userSignup from "../controller/userSignup.js"
import userLogin from "../controller/userLogin.js"
import editProfile from "../controller/editProfile.js"
import upload from "../../../middlewares/multer.js"
import userAuthentication from "../../../middlewares/auth.js"

const userRouter = Router();

userRouter.post('/signup', upload.single('profilePicture'), userSignup)
userRouter.post('/login', userLogin)
userRouter.put('/editProfile', userAuthentication, upload.single('profilePic'), editProfile)

export default userRouter;