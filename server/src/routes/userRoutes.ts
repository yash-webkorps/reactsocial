import { Router } from "express";
import signup from "../controllers/user/signup/signup.js"
import login from "../controllers/user/login/login.js"
import userAuthentication from "../middlewares/auth.js"
import upload from "../middlewares/multer.js";
import editProfile from "../controllers/user/editprofile/editProfile.js";
const router = Router();

router.post('/signup', upload.single('profilePicture'), signup)
router.post('/login', login)
router.put('/editprofile', userAuthentication, upload.single('profilePic'), editProfile)

export default router;