import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

// Registration validation
export const registrationValid = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("user", "admin").required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({ message: error.details.map(err => err.message) });
    return; 
  }

  next();
};

// Login validation
export const loginValid = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    res.status(400).json({ message: error.details.map(err => err.message) });
    return; 
  }

  next();
};
