import { Request, Response } from "express"
import { User } from "../../../models/index.js";
import { LoginRequestBody } from "../../../interfaces/interfaces.js";
import bcrypt from "bcrypt"
import { BAD_REQUEST, SUCCESS, UNAUTHORIZED } from "../../../constants/errorcodes.js";
import { handleError } from "../../../utils/errorHandler.js";
import generateToken from "../../../utils/generateToken.js";
import { PASSWORD_MISMATCH, USER_NOT_FOUND, VALIDATION_ERROR } from "../../../constants/errormessages.js";

const userLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as LoginRequestBody;

        if (!email || !password) {
          return res.status(BAD_REQUEST).json({ error: VALIDATION_ERROR });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
          return res.status(UNAUTHORIZED).json({ error: USER_NOT_FOUND });
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          res.status(SUCCESS).json({ token: generateToken(user.id, user.username, user.email) });
        } else {
          res.status(UNAUTHORIZED).json({ error: PASSWORD_MISMATCH });
        }
    } catch (error: unknown) {
        handleError(error, res)
    }
}

export default userLogin;
  