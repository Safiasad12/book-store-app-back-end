import { Request, Response, NextFunction } from "express";
import { registerUser } from "../service/user.service";


export const userRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await registerUser(req.body);
        res.status(201).json({
            message: "User registered successfully",
        });
    } catch (error) {
        next(error);
    }
};

