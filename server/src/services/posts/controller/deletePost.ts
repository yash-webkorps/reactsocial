import { Request, Response } from "express"
import { handleError } from "../../../utils/errorHandler.js";
import { Post } from "../../../models/index.js";
import cloudinary from "../../../configs/cloudinary.js";

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