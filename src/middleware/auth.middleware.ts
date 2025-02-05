import { Request, Response, NextFunction } from "express";
import { accessVerify } from "../util/jwt.util";
import { error } from "winston";

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let accessToken = req.header('Authorization');
        if (!accessToken) {
            throw error('accessToken required');
        }
        accessToken = accessToken.split(' ')[1];
        const payload: any = accessVerify(accessToken);
        if (!payload) {
            throw Error('invalid token');
        }
        if (payload.role === 'admin') {
            // req.body.admin_user_id = payload.id;
            next();
        } else {
            throw Error('Not authorized for this function');
        }
    } catch (error) {
        next(Error);
    }
}

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let accessToken = req.header('Authorization');
        
        if (!accessToken) {
            throw error('accessToken required');
        }
  
        accessToken = accessToken.split(' ')[1];

        
        const payload: any = accessVerify(accessToken);
       
        if (!payload) {
            throw Error('invalid token');
        }
        if (payload.role === 'user') {
            
            req.body.user_id = payload.id;
            next();

        } else {
            throw Error('Admin cannot be user');
        }
    } catch (error) {
        
        next(Error);
    }
}

