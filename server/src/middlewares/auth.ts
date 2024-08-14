import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { INVALID_TOKEN, NO_TOKEN_PROVIDED, USER_NOT_FOUND } from '../constants/errormessages.js';

const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('auth');
        if (!token) {
            return res.status(UNAUTHORIZED).json({ error: NO_TOKEN_PROVIDED });
        }
        
        
        const userAsPerToken = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number }; 
        const user = await User.findByPk(userAsPerToken.id);

        if (!user) {
            return res.status(NOT_FOUND).json({ error: USER_NOT_FOUND });
        }
        
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(UNAUTHORIZED).json({ error: INVALID_TOKEN });
        } else {
            res.status(INTERNAL_SERVER_ERROR).json({ error: INTERNAL_SERVER_ERROR });
        }
    }
};

export default auth;