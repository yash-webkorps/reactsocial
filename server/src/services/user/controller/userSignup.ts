import { Request, Response } from "express"
import { User } from "../../../models/index.js";
import { SignupRequestBody } from "../../../interfaces/interfaces.js";
import bcrypt from "bcrypt"
import { BAD_REQUEST, CONFLICT, SUCCESS } from "../../../constants/errorcodes.js";
import { handleError } from "../../../utils/errorHandler.js";
import { UNIQUE_CONSTRAINT_ERROR, VALIDATION_ERROR } from "../../../constants/errormessages.js";
import cloudinary from "../../../configs/cloudinary.js";
import { Op } from "sequelize";


const userSignup = async (req: Request, res: Response) => {
    let cloudinaryPublicId: string | null = null;
    try {
        const {username, email, password} = req.body as SignupRequestBody;
        
        const file = req.file;

        if (!username || !email || !password) {
            return res.status(BAD_REQUEST).json({ error: VALIDATION_ERROR });
        }

        const existingUser = await User.findOne({ where: {[Op.or]: [{username}, {email}]} });
        if (existingUser) {
          return res.status(CONFLICT).json({ error: UNIQUE_CONSTRAINT_ERROR });
        }

        const hash = await bcrypt.hash(password, 10);
        if (file) {
            const result = await cloudinary.uploader.upload(file.path)
            cloudinaryPublicId = result.public_id;
            await User.create({ username, profilePic: result.secure_url, email, password: hash, cloudinaryPublicId});
        }

        res.status(SUCCESS).json({message: "Signup success!"})
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

export default userSignup;