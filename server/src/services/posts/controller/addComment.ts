import { Request, Response } from "express"
import { handleError } from "../../../utils/errorHandler.js";
import { CommentBody } from "../../../interfaces/interfaces.js";
import { Post, Comment } from "../../../models/index.js";

const addComment = async (req: Request, res: Response) => {
    try{
        const {title, comment} = req.body as CommentBody;
        
        const post = await Post.findOne({where: {title}})

        if (post) {
            Comment.create({comment, userId: req.user.id, postId: post.id})
        }

        res.status(201).json({comment: comment})
    }
    catch (error: unknown) {
        handleError(error, res)
    }
}

export default addComment;