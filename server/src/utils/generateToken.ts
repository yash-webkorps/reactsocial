import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id: string, username: string, email: string) => {
    return jwt.sign({ id, username, email }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
}

export default generateToken;