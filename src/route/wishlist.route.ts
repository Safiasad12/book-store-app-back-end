import { Router } from "express";
import { userAuth } from "../middleware/auth.middleware";
import { addToWishlist, getWishlist } from "../controller/wishlist.controller";

const wishlistRouter = Router();


wishlistRouter.get('/', userAuth, getWishlist);

wishlistRouter.post('/:BookId', userAuth, addToWishlist);



export default wishlistRouter;