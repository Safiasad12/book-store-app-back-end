import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';

const bookIdSchema = Joi.object({
  BookId: Joi.string().required().messages({
    'string.base': 'Book ID must be a string.',
    'any.required': 'Book ID is required.'
  })
});
    
export const validateBookId = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = bookIdSchema.validate(req.params);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      errors: error.details.map((detail) => detail.message)
    });
  } else {
    next();
  }
};
