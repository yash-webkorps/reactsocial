import express, {Express} from "express"
import bodyParser from "body-parser";
import cors from 'cors';
import appRoutes from './routes/appRoutes.js'
import dotenv from "dotenv";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Like from "./models/Like.js";
import Comment from "./models/Comment.js";

dotenv.config();
const app: Express = express();

app.use(cors());
app.use(bodyParser.json())

app.use(appRoutes)

User.hasMany(Post)
Post.belongsTo(User)

User.hasMany(Like)
Like.belongsTo(User)

Post.hasMany(Like)
Like.belongsTo(Post)

User.hasMany(Comment)
Comment.belongsTo(User)

Post.hasMany(Comment)
Comment.belongsTo(Post)


const PORT = process.env.PORT;

if (PORT) {
    console.log(`\nServer is running on ${PORT}`);
    app.listen(PORT);
}else{
    console.log('Unable to get the PORT.'); 
}
