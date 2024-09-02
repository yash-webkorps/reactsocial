import { Request, Response } from "express";
import { SUCCESS } from "../../constants/errorcodes.js";
import { handleError } from "../../utils/errorHandler.js";
import Post from "../../models/Post.js";
import User from "../../models/User.js";
import Like from "../../models/Like.js";
import Comment from "../../models/Comment.js";
import { Op } from "sequelize";

const getPostsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;
    const offset = (page - 1) * limit;
    const sortOption = req.query.sortOption as string;

    let order: any[] = [["createdAt", "DESC"]]; // Default sorting: Newest first

    // Apply sorting based on sortOption
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
      order, // Apply sorting order to the query
    });

    const postsWithLikeStatus = await Promise.all(
      posts.map(async (post) => {
        const isLiked = !!(await Like.findOne({
          where: {
            userId,
            postId: post.id,
          },
        }));

        return {
          ...post.toJSON(), // Convert Sequelize model instance to plain object
          isLiked,
        };
      })
    );

    const postWithComments = await Promise.all(
      postsWithLikeStatus.map(async (post) => {
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

// const getPostsController = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user.id;

//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 3;
//     const offset = (page - 1) * limit;

//     const posts = await Post.findAll({
//       where: {
//         userId: {
//           [Op.ne]: userId,
//         },
//       },
//       include: [
//         {
//           model: User,
//           as: "user",
//           attributes: ["username"],
//         },
//       ],
//       limit,
//       offset,
//     });

//     // Check if the current user has liked each post
//     const postsWithLikeStatus = await Promise.all(
//       posts.map(async (post) => {
//         const isLiked = !!(await Like.findOne({
//           where: {
//             userId,
//             postId: post.id,
//           },
//         }));

//         return {
//           ...post.toJSON(), // Convert Sequelize model instance to plain object
//           isLiked,
//         };
//       })
//     );

//     // fetching all comments for specific post
//     const postWithComments = await Promise.all(
//       postsWithLikeStatus.map(async (post) => {
//         const comments = await Comment.findAll({
//           where: { postId: post.id },
//           attributes: ["comment"],
//           include: [
//             {
//               model: User,
//               attributes: ["username"], // Fetch the username from the User model
//             },
//           ],
//         });

//         return {
//           ...post,
//           comments,
//         };
//       })
//     );

//     res.status(SUCCESS).json({ posts: postWithComments, user: req.user });
//   } catch (error: unknown) {
//     handleError(error, res);
//   }
// };

export default getPostsController;
