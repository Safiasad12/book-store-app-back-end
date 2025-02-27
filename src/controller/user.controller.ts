import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../service/user.service";


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

export const userLogin = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const data = await loginUser(req.body);
        res.status(202).json({
            message: 'user login successful',
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
        });
    } catch (error) {
        next(error);
    }
}

