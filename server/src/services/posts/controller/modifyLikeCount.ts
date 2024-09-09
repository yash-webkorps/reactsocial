import { Request, Response } from "express"
import { modifyLikeRequestBody } from "../../../interfaces/interfaces.js";
import { SUCCESS, UNAUTHORIZED } from "../../../constants/errorcodes.js";
import { handleError } from "../../../utils/errorHandler.js";
import { Post, Like} from "../../../models/index.js";
import { POST_NOT_FOUND } from "../../../constants/errormessages.js";


const modifyLikeCount = async (req: Request, res: Response) => {
    try {
        const { title } = req.body as modifyLikeRequestBody;
        
        const post = await Post.findOne({where: {title}})
        
        if (post) {
            const existingLike = await Like.findOne({where:{userId: req.user.id, postId: post.id}})

            let updatedLikeCounts = post.likeCounts || 0;
            
            if (!existingLike) {
                updatedLikeCounts++;
                await Like.create({userId: req.user.id, postId: post.id})
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
        console.log(error);
        
        handleError(error, res)
    }
}

export default modifyLikeCount;