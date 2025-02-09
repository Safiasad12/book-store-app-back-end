import { Router } from "express";
import { userAuth } from "../middleware/auth.middleware";
import { addToCart, emptyCart, getCartDetails, removeItem, updateQuantity } from "../controller/cart.controller";
import { addBookValid, removeBookValid } from "../validator/cart.validator";


const cartRouter = Router();


cartRouter.get('/', userAuth, getCartDetails);

cartRouter.delete('/', userAuth, emptyCart);

cartRouter.post('/:BookId', userAuth, addBookValid, addToCart);

cartRouter.put('/:BookId', userAuth, updateQuantity);

cartRouter.delete('/:BookId', userAuth, removeBookValid, removeItem);




export default cartRouter;