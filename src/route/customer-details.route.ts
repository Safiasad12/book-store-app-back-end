import { Router } from "express";
import { userAuth } from "../middleware/auth.middleware";
import { addCustomerDetails, getCustomerDetails } from "../controller/customer-details.controller";


const customerDetailsRouter = Router();


customerDetailsRouter.post('/', userAuth, addCustomerDetails);

customerDetailsRouter.get('/', userAuth, getCustomerDetails);



export default customerDetailsRouter;