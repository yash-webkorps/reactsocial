import express, {Express} from "express"
import bodyParser from "body-parser";
import cors from 'cors';
import appRoutes from './routes/appRoutes.js'
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();

app.use(cors());
app.use(bodyParser.json())

app.use(appRoutes)

const PORT = process.env.PORT;

if (PORT) {
    console.log(`\nServer is running on ${PORT}`);
    app.listen(PORT);
}else{
    console.log('Unable to get the PORT.'); 
}
