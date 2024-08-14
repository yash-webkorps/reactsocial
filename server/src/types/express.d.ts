// types/express.d.ts
import { User } from '../models/User.js'; // Adjust the import based on the actual path

declare global {
    namespace Express {
        interface Request {
            user?: User; // Adjust the type based on your User model
        }
    }
}
