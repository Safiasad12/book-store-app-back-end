import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

// Registration validation
export const registrationValid = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    throw error;
  }
  next();
};


export const loginValid = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    const {error} = schema.validate(req.body);
    if(error){
        throw error;
    }
    next();
}
