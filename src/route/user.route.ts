import { Router } from "express";
import { forgotPassword, refreshtoken, ResetPassword, userLogin, userRegistration } from "../controller/user.controller";
import { registrationValid, loginValid } from "../validator/user.validator";
import { userAuth } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.post("/", loginValid, userLogin);
userRouter.post("/register", registrationValid, userRegistration);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", userAuth, ResetPassword);
userRouter.post("/refreshtoken", refreshtoken);

export default userRouter;


