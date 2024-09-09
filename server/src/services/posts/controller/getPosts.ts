import { Request, Response } from "express";
import { SUCCESS } from "../../../constants/errorcodes.js";
import { handleError } from "../../../utils/errorHandler.js";
import { Post, User, Like, Comment} from "../../../models/index.js";
import { Op, OrderItem } from "sequelize";

const getPosts = async (req: Request, res: Response) => {
  console.log("Posts");
  
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;
    const offset = (page - 1) * limit;
    const sortOption = req.query.sortOption as string;

    let order: OrderItem[] = [["createdAt", "DESC"]];

    if (sortOption === "oldest") {
      order = [["createdAt", "ASC"]];
    } else if (sortOption === "mostLiked") {
      order = [["likeCounts", "DESC"]];
    }

    const posts = await Post.findAll({
      where: {
        userId: {
          [Op.ne]: userId,
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
      limit,
      offset,
      order,
    });

    const postsWithLikeStatusAndUsers = await Promise.all(
      posts.map(async (post) => {
        // Check if the post is liked by the current user
        const isLiked = !!(await Like.findOne({
          where: {
            userId,
            postId: post.id,
          },
        }));

        // Fetch the users who liked the post
        const likedUsers = await Like.findAll({
          where: { postId: post.id },
          include: [
            {
              model: User,
              attributes: ["username", "profilePic"],
            },
          ],
        });

        const likedBy = likedUsers.map((like) => ({
          username: like.user.username,
          profilePic: like.user.profilePic,
        }));

        return {
          ...post.toJSON(),
          isLiked,
          likedBy, // Add the likedBy field
        };
      })
    );

    const postWithComments = await Promise.all(
      postsWithLikeStatusAndUsers.map(async (post) => {
        const comments = await Comment.findAll({
          where: { postId: post.id },
          attributes: ["comment"],
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
        });

        return {
          ...post,
          comments,
        };
      })
    );

    res.status(SUCCESS).json({ posts: postWithComments, user: req.user });
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export default getPosts;
