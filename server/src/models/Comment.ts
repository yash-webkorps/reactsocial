import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../configs/database.js";
import { CommentAttributes } from "../interfaces/interfaces.js";

interface CommentCreationAttributes extends Optional<CommentAttributes, 'id'> {}

interface CommentInstance extends Model<CommentAttributes, CommentCreationAttributes>, CommentAttributes {}

const Comment = sequelize.define<CommentInstance>('comment', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4()
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUIDV4,
    references: {
      model: 'users',
      key: 'id',
    },
    allowNull: false,
  },
  postId: {
    type: DataTypes.UUIDV4,
    references: {
      model: 'posts',
      key: 'id',
    },
    allowNull: false,
  },
});

export default Comment;
