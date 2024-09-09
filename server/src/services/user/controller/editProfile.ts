import { Request, Response } from "express"
import { ExtendedSignupRequestBody } from "../../../interfaces/interfaces.js"
import { BAD_REQUEST } from "../../../constants/errorcodes.js"
import { handleError } from "../../../utils/errorHandler.js"
import { VALIDATION_ERROR } from "../../../constants/errormessages.js"
import { User } from "../../../models/index.js"
import cloudinary from "../../../configs/cloudinary.js"
import bcrypt from "bcrypt"


const editProfile = async (req: Request, res: Response) => {
    let cloudinaryPublicId: string | null = null;
    try {
        console.log("editProfile");
      
        const {username, email, password, visibility} = req.body as ExtendedSignupRequestBody;
        
        const file = req.file;
        
        if (!username || !email || !password || !visibility) {
            return res.status(BAD_REQUEST).json({ error: VALIDATION_ERROR });
        }
        const user = await User.findByPk(req.user.id)

        if (user && file) {
          
            await cloudinary.uploader.destroy(user.cloudinaryPublicId);
            
            const result = await cloudinary.uploader.upload(file.path)
            cloudinaryPublicId = result.public_id;

            const isPrivate = visibility === "private" ? true : false;
            const hash = await bcrypt.hash(password, 10);
            const updatedUser = await user.update({username, email, password: hash, profilePic: result.secure_url, cloudinaryPublicId, isPrivate})

            res.status(201).json({updatedUser: updatedUser, userName: user.username})
        }
        
    } catch (error: unknown) {
        if (cloudinaryPublicId) {
            try {
              await cloudinary.uploader.destroy(cloudinaryPublicId);
            } catch (deleteError) {
              console.error("Cloudinary deletion error:", deleteError);
            }
          }
        console.log(error);
        
        handleError(error, res)
    }
}

export default editProfile;