import { Router } from "express";
import { userAuth } from "../middleware/auth.middleware";
import { addToWishlist } from "../controller/wishlist.controller";

const wishlistRouter = Router();


wishlistRouter.post('/:BookId', userAuth, addToWishlist);


export default wishlistRouter;