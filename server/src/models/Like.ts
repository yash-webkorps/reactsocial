import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../utils/database.js";
import { LikeAttributes } from "../interfaces/interfaces.js";

interface LikeCreationAttributes extends Optional<LikeAttributes, 'id'> {}

interface LikeInstance extends Model<LikeAttributes, LikeCreationAttributes>, LikeAttributes {}

const Like = sequelize.define<LikeInstance>('like', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  }
});

export default Like;
