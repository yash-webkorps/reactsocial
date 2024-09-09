import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../configs/database.js";

// Define the attributes of the User model
interface PostAttributes {
  id: string;
  title: string;
  description: string;
  content: string;
  cloudinaryPublicId: string;
  likeCounts?: number;
  userId: string;
  isPrivate: boolean;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

interface PostInstance extends Model<PostAttributes, PostCreationAttributes>, PostAttributes {
  [x: string]: any;
}

const Post = sequelize.define<PostInstance>('post', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4()
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
  cloudinaryPublicId: {
    type: DataTypes.STRING
  },
  likeCounts: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUIDV4,
    references: {
      model: 'Users',
      key: 'id',
    }},
  isPrivate: {
    type: DataTypes.BOOLEAN
  }
});

export default Post;
