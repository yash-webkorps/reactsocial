import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../utils/database.js";
import { CommentAttributes } from "../interfaces/interfaces.js";

interface CommentCreationAttributes extends Optional<CommentAttributes, 'id'> {}

interface CommentInstance extends Model<CommentAttributes, CommentCreationAttributes>, CommentAttributes {}

const Comment = sequelize.define<CommentInstance>('comment', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Comment;
