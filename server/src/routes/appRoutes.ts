import { Router } from "express";
import userRoutes from "./userRoutes.js"
import postRoutes from "./postRoutes.js"

const router = Router();

router.use(userRoutes)
router.use(postRoutes)

export default router;