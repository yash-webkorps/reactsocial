import { Request, Response } from "express"
import { PostRequestBody } from "../../../interfaces/interfaces.js";
import { BAD_REQUEST, SUCCESS } from "../../../constants/errorcodes.js";
import { handleError } from "../../../utils/errorHandler.js";
import { VALIDATION_ERROR } from "../../../constants/errormessages.js";
import { Post } from "../../../models/index.js";
import cloudinary from "../../../configs/cloudinary.js";


const addPost = async (req: Request, res: Response) => {
    let cloudinaryPublicId: string | null = null;
    try {
        const {title, description, visibility} = req.body as PostRequestBody;
        
        const file = req.file;

        const user = req.user;
        
        if (!title || !description|| !visibility) {
            return res.status(BAD_REQUEST).json({ error: VALIDATION_ERROR });
        }

        if (file) {
            const result = await cloudinary.uploader.upload(file.path)
            cloudinaryPublicId = result.public_id;
            const isPrivate = visibility === "private" ? true : false;
            const post = await Post.create({title, description, content: result.secure_url,cloudinaryPublicId, userId: user.id, likeCounts: 0, isPrivate});
            res.status(SUCCESS).json({post: post, userName: user.username})
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

export default addPost;