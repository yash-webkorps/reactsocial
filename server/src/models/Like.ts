import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../configs/database.js";
import { LikeAttributes } from "../interfaces/interfaces.js";

interface LikeCreationAttributes extends Optional<LikeAttributes, 'id'> {}

interface LikeInstance extends Model<LikeAttributes, LikeCreationAttributes>, LikeAttributes {
  user: any;
}

const Like = sequelize.define<LikeInstance>('like', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4()
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

export default Like;
