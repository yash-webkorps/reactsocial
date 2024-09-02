import { Request, Response } from "express"
import { SUCCESS } from "../../constants/errorcodes.js";
import { handleError } from "../../utils/errorHandler.js";

const sortPosts = async (req: Request, res: Response) => {
  
    try {
        const sortOption = req.query.sortOption as string;
        
        const posts = req.body;
      
        const sortedPosts = [...posts];

        if (sortOption === "newest") {
          sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } 
        else if (sortOption === "oldest") {
          sortedPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        } 
        else if (sortOption === "mostLiked") {
          sortedPosts.sort((a, b) => b.likeCounts - a.likeCounts);
        }

        res.status(SUCCESS).json({sortedPosts})
    } catch (error: unknown) {
        handleError(error, res)
    }
}

export default sortPosts;