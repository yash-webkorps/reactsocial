import { Request, Response } from "express"
import { BAD_REQUEST, SUCCESS } from "../../constants/errorcodes.js";
import { handleError } from "../../utils/errorHandler.js";
import { VALIDATION_ERROR } from "../../constants/errormessages.js";
import { v4 as uuidv4 } from 'uuid';
import { CommentBody } from "../../interfaces/interfaces.js";
import Comment from "../../models/Comment.js";
import Post from "../../models/Post.js";
import cloudinary from "../../utils/cloudinary.js";


const deletePost = async (req: Request, res: Response) => {
    try{
        const postId = req.params.postId;

        const post = await Post.findByPk(postId)

        if (post) {           
            await cloudinary.uploader.destroy(post.cloudinaryPublicId);
            await Post.destroy({where: {id: postId}})
            res.status(201).json({success: true})
        }
    }
    catch (error: unknown) {
        handleError(error, res)
    }
}

export default deletePost;