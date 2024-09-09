import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../configs/database.js";
import { UserAttributes } from "../interfaces/interfaces.js";

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

const User = sequelize.define<UserInstance>('user', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4()
  },
  profilePic: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cloudinaryPublicId: {
    type: DataTypes.STRING
  },
  isPrivate: {
    type: DataTypes.BOOLEAN
  },
  isAdmin: {
    type: DataTypes.BOOLEAN
  }
});

export default User;
