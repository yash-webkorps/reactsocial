import { Request, Response } from "express"
import { SUCCESS } from "../../constants/errorcodes.js";
import { handleError } from "../../utils/errorHandler.js";
import Post from "../../models/Post.js";
import User from "../../models/User.js";
import Like from "../../models/Like.js";
import Comment from "../../models/Comment.js";

const getPostsController = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const posts = await Post.findAll({      include: [
            {
              model: User,
              as: 'user',
              attributes: ['username']
            }
          ]});

        // Check if the current user has liked each post
        const postsWithLikeStatus = await Promise.all(posts.map(async (post) => {
            const isLiked = !!(await Like.findOne({
                where: {
                    userId,
                    postId: post.id
                }
            }));
            
            return {
                ...post.toJSON(), // Convert Sequelize model instance to plain object
                isLiked
            };
        }));

        // fetching all comments for specific post
        const postWithComments = await Promise.all(postsWithLikeStatus.map(async (post) => {
            const comments = await Comment.findAll({where: {postId: post.id}, attributes: ['comment'],   include: [
                {
                  model: User,
                  attributes: ['username'], // Fetch the username from the User model
                },
              ]})
              
            return {
                ...post,
                comments
            }
        }))

        console.log(postWithComments);
        
          
        res.status(SUCCESS).json({posts: postWithComments, user: req.user})
    } catch (error: unknown) {
        handleError(error, res)
    }
}

export default getPostsController;