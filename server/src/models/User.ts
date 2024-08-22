import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import sequelize from "../utils/database.js";
import { UserAttributes } from "../interfaces/interfaces.js";


// Define the creation attributes, omitting fields that will be auto-generated
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Extend the Model class with the UserAttributes and UserCreationAttributes
interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

// Define the User model using the define method
const User = sequelize.define<UserInstance>('user', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
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
  isAdmin: {
    type: DataTypes.BOOLEAN
  }
});

export default User;
