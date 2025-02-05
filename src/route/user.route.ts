import { Router } from "express";
import { userLogin, userRegistration } from "../controller/user.controller";
import { registrationValid, loginValid } from "../validator/user.validator";

const userRouter = Router();

userRouter.post("/", loginValid, userLogin);
userRouter.post("/register", registrationValid, userRegistration);


export default userRouter;


