import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, forgotPasswordService } from "../service/user.service";


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

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await forgotPasswordService(req.body);
        res.status(200).json({
            message: `reset token has been sent to ${req.body.email}`
        });
    } catch (error) {
        console.log("abc")
        next(error);
    }
}

