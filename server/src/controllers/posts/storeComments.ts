import { Request, Response } from "express"
import { BAD_REQUEST, SUCCESS } from "../../constants/errorcodes.js";
import { handleError } from "../../utils/errorHandler.js";
import { VALIDATION_ERROR } from "../../constants/errormessages.js";
import { v4 as uuidv4 } from 'uuid';
import { CommentBody } from "../../interfaces/interfaces.js";
import Comment from "../../models/Comment.js";
import Post from "../../models/Post.js";


const storeComments = async (req: Request, res: Response) => {
    try{
        const {title, comment} = req.body as CommentBody;
        
        const post = await Post.findOne({where: {title}})

        if (post) {
            Comment.create({id: uuidv4(), comment, userId: req.user.id, postId: post.id})
        }

        res.status(201).json({comment: comment})
    }
    catch (error: unknown) {
        handleError(error, res)
    }
}

export default storeComments;