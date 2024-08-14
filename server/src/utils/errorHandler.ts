import { Response } from "express";
import { BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR } from "../constants/errorcodes.js";
import { VALIDATION_ERROR, UNIQUE_CONSTRAINT_ERROR, UNEXPECTED_ERROR, UNKNOWN_ERROR } from "../constants/errormessages.js";

export const handleError = (error: unknown, res: Response) => {
    if (error instanceof Error) {
        console.error("Error:", error);

        if (error.name === "SequelizeValidationError") {
            return res.status(BAD_REQUEST).json({ error: VALIDATION_ERROR });
        } else if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(CONFLICT).json({ error: UNIQUE_CONSTRAINT_ERROR });
        } else {
            return res.status(INTERNAL_SERVER_ERROR).json({ error: UNEXPECTED_ERROR });
        }
    } else {
        console.log("Unexpected error", error);
        return res.status(INTERNAL_SERVER_ERROR).json({ error: UNKNOWN_ERROR });
    }
};
