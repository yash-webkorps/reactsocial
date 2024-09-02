import { Request, Response } from "express";
import { SUCCESS } from "../../constants/errorcodes.js";
import { handleError } from "../../utils/errorHandler.js";
import Post from "../../models/Post.js";
import User from "../../models/User.js";
import Like from "../../models/Like.js";
import Comment from "../../models/Comment.js";

const PostDetails = async (req: Request, res: Response) => {    
    try {
        const userId = req.user.id;
        const { postId } = req.params;

        // Fetch the specific post by ID
        const post = await Post.findByPk(postId, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username'],
                },
            ],
        });
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        // Check if the current user has liked the post
        const isLiked = !!(await Like.findOne({
            where: {
                userId,
                postId: post.id,
            },
        }));

        // Convert post to plain object and add the isLiked status
        const postWithLikeStatus = {
            ...post.toJSON(),
            isLiked,
        };
        
        // Fetch all comments for the specific post
        const comments = await Comment.findAll({
            where: { postId: post.id },
            attributes: ['comment'],
            include: [
                {
                    model: User,
                    attributes: ['username'], // Fetch the username from the User model
                },
            ],
        });
        
        // Add comments to the post object
        const postWithComments = {
            ...postWithLikeStatus,
            comments,
        };
        
        res.status(SUCCESS).json({ post: postWithComments, user: req.user });
    } catch (error: unknown) {
        handleError(error, res);
    }
};

export default PostDetails;
