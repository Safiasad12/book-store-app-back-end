import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateCreateBook = (req: Request, res: Response, next: NextFunction) : any => {
  const schema = Joi.object({
    bookName: Joi.string().required().messages({
      "string.empty": "Book name is required",
    }),
    author: Joi.string().required().messages({
      "string.empty": "Author name is required",
    }),
    bookImage: Joi.string().optional(),
    quantity: Joi.number().integer().min(1).required().messages({
      "number.base": "Quantity must be a number",
      "number.min": "Quantity must be at least 1",
    }),
    price: Joi.number().min(0).required().messages({
      "number.base": "Price must be a number",
      "number.min": "Price cannot be negative",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description is required",
    }),
    discountPrice: Joi.number().min(0).required().messages({
      "number.base": "Discount price must be a number",
      "number.min": "Discount price cannot be negative",
    }),
    admin_user_id: Joi.string().required().messages({
      "string.empty": "Admin ID is required",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ errors: error.details.map((err) => err.message) });
  }

  next();
};


export const validateUpdateBook = (req: Request, res: Response, next: NextFunction) : any => {
  const schema = Joi.object({
    bookName: Joi.string().optional(),
    author: Joi.string().optional(),
    bookImage: Joi.string().optional(),
    quantity: Joi.number().integer().min(1).optional(),
    price: Joi.number().min(0).optional(),
    description: Joi.string().optional(),
    discountPrice: Joi.number().min(0).optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ errors: error.details.map((err) => err.message) });
  }

  next();
};


export const validateBookId = (req: Request, res: Response, next: NextFunction) : any => {
  const schema = Joi.object({
    BookId: Joi.string().required().messages({
      "string.empty": "Book ID is required",
    }),
  });

  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({ errors: error.details.map((err) => err.message) });
  }

  next();
};
