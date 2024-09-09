import { Router } from "express"
import userRouter from "../services/user/api/index.js"
import postRouter from "../services/posts/api/index.js";
import '../models/relations.js'

const router = Router();

router.use('/user', userRouter)
router.use('/post', postRouter)

export default router