import User from './User.js';
import Post from './Post.js';
import Like from './Like.js';
import Comment from './Comment.js';

User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(Like);
Like.belongsTo(User);

Post.hasMany(Like);
Like.belongsTo(Post);

User.hasMany(Comment);
Comment.belongsTo(User);

Post.hasMany(Comment);
Comment.belongsTo(Post);