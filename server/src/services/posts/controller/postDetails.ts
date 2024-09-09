import { Request, Response } from "express";
import { SUCCESS } from "../../../constants/errorcodes.js";
import { handleError } from "../../../utils/errorHandler.js";
import { Post, User, Like, Comment} from "../../../models/index.js";


const PostDetails = async (req: Request, res: Response) => {    
    try {        
        const { postId } = req.params;
        const userId = req.user.id;

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

        // if (user?.isPrivate || post?.isPrivate) {
        //     const token = req.header('auth');
        //     if (!token) {
        //         return res.status(UNAUTHORIZED).json({ error: NO_TOKEN_PROVIDED });
        //     }
            
        //     const userAsPerToken = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number }; 
        //     const user = await User.findByPk(userAsPerToken.id);
    
        //     if (!user) {
        //         return res.status(NOT_FOUND).json({ error: USER_NOT_FOUND });
        //     }
        // }

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
