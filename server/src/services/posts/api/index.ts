import { Router } from "express";
import addPost from "../controller/addPost.js"
import getPosts from "../controller/getPosts.js"
import modifyLikeCount from "../controller/modifyLikeCount.js"
import addComment from "../controller/addComment.js"
import deletePost from "../controller/deletePost.js"
import updatePost from "../controller/updatePost.js"
import usersPosts from "../controller/usersPosts.js"
import PostDetails from "../controller/postDetails.js"
import userAuthentication from "../../../middlewares/auth.js"
import upload from "../../../middlewares/multer.js"

const postRouter = Router();

postRouter.get('/',userAuthentication, getPosts)
postRouter.post('/', userAuthentication, upload.single('content'), addPost)
postRouter.put('/modifyLikeCount', userAuthentication, modifyLikeCount)
postRouter.put('/:postId', userAuthentication, upload.single('content'), updatePost)
postRouter.delete('/:postId', userAuthentication, deletePost)
postRouter.post('/addComment', userAuthentication, addComment)
postRouter.get('/usersPosts',userAuthentication, usersPosts)
postRouter.get('/postdetails/:postId', userAuthentication, PostDetails)

export default postRouter;