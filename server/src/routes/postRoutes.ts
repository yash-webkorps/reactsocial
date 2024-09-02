import { Router } from "express";
import add from "../controllers/posts/add.js"
import get from "../controllers/posts/get.js"
import modifyLikeCount from "../controllers/posts/modifyLikeCount.js"
import userAuthentication from "../middlewares/auth.js"
import upload from "../middlewares/multer.js";
import storeComments from "../controllers/posts/storeComments.js";
import deletePost from "../controllers/posts/delete.js";
import updatePost from "../controllers/posts/updatePost.js";
import userPosts from "../controllers/posts/userPosts.js";
import PostDetails from "../controllers/posts/postDetails.js";
import sortPosts from "../controllers/posts/sortPosts.js";

const router = Router();

router.get('/posts',userAuthentication, get)
router.get('/userposts',userAuthentication, userPosts)
router.get('/postdetails/:postId',userAuthentication, PostDetails)
router.post('/addPost', userAuthentication, upload.single('content'), add)
router.post('/storeComments', userAuthentication, storeComments)
router.post('/sortPosts', userAuthentication, sortPosts)
router.put('/updatePost/:postId', userAuthentication, upload.single('content'), updatePost)
router.put('/modifyLikeCount', userAuthentication, modifyLikeCount)
router.delete('/deletePost/:postId', userAuthentication, deletePost)

export default router;