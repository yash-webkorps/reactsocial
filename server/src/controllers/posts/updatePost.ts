import { Request, Response } from "express"
import { PostRequestBody } from "../../interfaces/interfaces.js";
import { BAD_REQUEST, SUCCESS } from "../../constants/errorcodes.js";
import { handleError } from "../../utils/errorHandler.js";
import { VALIDATION_ERROR } from "../../constants/errormessages.js";
import Post from "../../models/Post.js";
import { v4 as uuidv4 } from 'uuid';
import cloudinary from "../../utils/cloudinary.js";
import User from "../../models/User.js";


const updatePost = async (req: Request, res: Response) => {
    let cloudinaryPublicId: string | null = null;
    try {
        const {title, description} = req.body as PostRequestBody;
        
        const file = req.file;
        
        if (!title || !description) {
            return res.status(BAD_REQUEST).json({ error: VALIDATION_ERROR });
        }

        const post = await Post.findByPk(req.params.postId)

        console.log(post, file);
        if (post && file) {
          
            await cloudinary.uploader.destroy(post.cloudinaryPublicId);
            
            const result = await cloudinary.uploader.upload(file.path)
            cloudinaryPublicId = result.public_id;
            const updatedPost = await post.update({title, description, content: result.secure_url, cloudinaryPublicId})
            
            const user = await User.findByPk(post.userId)

            if (user) {
              res.status(201).json({updatedPost: updatedPost, userName: user.username})
            }
        }
        
    } catch (error: unknown) {
        if (cloudinaryPublicId) {
            try {
              await cloudinary.uploader.destroy(cloudinaryPublicId);
            } catch (deleteError) {
              console.error("Cloudinary deletion error:", deleteError);
            }
          }
        handleError(error, res)
    }
}

export default updatePost;