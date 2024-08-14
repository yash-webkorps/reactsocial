import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../utils/database.js";

// Define the attributes of the User model
interface PostAttributes {
  id: string;
  title: string;
  description: string;
  content: string;
  likeCounts?: number;
  userId: string;
}

// Define the creation attributes, omitting fields that will be auto-generated
interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

// Extend the Model class with the PostAttributes and PostCreationAttributes
interface PostInstance extends Model<PostAttributes, PostCreationAttributes>, PostAttributes {}

// Define the Post model using the define method
const Post = sequelize.define<PostInstance>('post', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likeCounts: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    }}
});

export default Post;
