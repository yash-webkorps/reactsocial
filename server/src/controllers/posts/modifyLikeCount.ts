import { Request, Response } from "express"
import { modifyLikeRequestBody } from "../../interfaces/interfaces.js";
import { BAD_REQUEST, CONFLICT, SUCCESS, UNAUTHORIZED } from "../../constants/errorcodes.js";
import { handleError } from "../../utils/errorHandler.js";
import Post from "../../models/Post.js";
import { POST_NOT_FOUND, UNIQUE_CONSTRAINT_ERROR, VALIDATION_ERROR } from "../../constants/errormessages.js";
import Like from "../../models/Like.js";
import { v4 as uuidv4 } from 'uuid';


const modifyLikeCount = async (req: Request, res: Response) => {
    try {
        const {title, isLiked} = req.body as modifyLikeRequestBody;
        
        const post = await Post.findOne({where: {title}})
        
        if (post) {  
            const existingLike = await Like.findOne({where:{userId: req.user.id, postId: post.id}})

            let updatedLikeCounts = post.likeCounts || 0;
            
            if (!existingLike) {
                updatedLikeCounts++;
                await Like.create({id: uuidv4(), userId: req.user.id, postId: post.id})
            }else{
                updatedLikeCounts--;
                await Like.destroy({where: {id: existingLike.id}})
            }

            await post.update({likeCounts: updatedLikeCounts})
            res.status(SUCCESS).json({success: true})
        }
        else{
            return res.status(UNAUTHORIZED).json({error: POST_NOT_FOUND});
        }
    } catch (error: unknown) {
        handleError(error, res)
    }
}

export default modifyLikeCount;