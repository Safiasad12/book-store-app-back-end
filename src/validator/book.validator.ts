import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';

// Validate book creation
export const validateCreateBook = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    bookName: Joi.string().trim().required().messages({
      'string.base': 'Book name must be a string.',
      'any.required': 'Book name is required.'
    }),
    author: Joi.string().trim().required().messages({
      'string.base': 'Author must be a string.',
      'any.required': 'Author is required.'
    }),
    quantity: Joi.number().required().messages({
      'number.base': 'Quantity must be a number.',
      'any.required': 'Quantity is required.'
    }),
    price: Joi.number().required().messages({
      'number.base': 'Price must be a number.',
      'any.required': 'Price is required.'
    }),
    description: Joi.string().trim().required().messages({
      'string.base': 'Description must be a string.',
      'any.required': 'Description is required.'
    }),
    discountPrice: Joi.number().required().messages({
      'number.base': 'Discount price must be a number.',
      'any.required': 'Discount price is required.'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      errors: error.details.map((detail) => detail.message)
    });
  } else {
    next();
  }
};

// Validate book update
export const validateUpdateBook = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    bookName: Joi.string().trim().optional(),
    author: Joi.string().trim().optional(),
    quantity: Joi.number().optional(),
    price: Joi.number().optional(),
    description: Joi.string().trim().optional(),
    discountPrice: Joi.number().optional(),
    adminId: Joi.string().trim().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      errors: error.details.map((detail) => detail.message)
    });
  } else {
    next();
  }
};

// Validate book ID from params
export const validateBookId = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    BookId: Joi.string().required().messages({
      'string.base': 'Book ID must be a string.',
      'any.required': 'Book ID is required.'
    })
  });

  const { error } = schema.validate(req.params);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      errors: error.details.map((detail) => detail.message)
    });
  } else {
    next();
  }
};
