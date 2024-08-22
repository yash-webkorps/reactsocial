import { Router } from "express";
import addPostController from "../controllers/posts/addPostController.js"
import getPostsController from "../controllers/posts/getPostsController.js"
import modifyLikeCount from "../controllers/posts/modifyLikeCount.js"
import userAuthentication from "../middlewares/auth.js"
import upload from "../middlewares/multer.js";
import storeComments from "../controllers/posts/storeComments.js";
import deletePost from "../controllers/posts/deletePost.js";
import updatePost from "../controllers/posts/updatePost.js";
// import isLikedController from "../controllers/posts/isLikedController.js";

const router = Router();

router.get('/posts',userAuthentication, getPostsController)
router.post('/addPost', userAuthentication, upload.single('content'), addPostController)
router.post('/storeComments', userAuthentication, storeComments)
router.put('/updatePost/:postId', userAuthentication, upload.single('content'), updatePost)
router.put('/modifyLikeCount', userAuthentication, modifyLikeCount)
router.delete('/deletePost/:postId', userAuthentication, deletePost)

export default router;