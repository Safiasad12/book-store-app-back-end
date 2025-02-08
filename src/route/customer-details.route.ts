import { Router } from "express";
import { userAuth } from "../middleware/auth.middleware";
import { addCustomerDetails, getCustomerDetails, updateCustomerDetails } from "../controller/customer-details.controller";


const customerDetailsRouter = Router();


customerDetailsRouter.post('/', userAuth, addCustomerDetails);

customerDetailsRouter.get('/', userAuth, getCustomerDetails);

customerDetailsRouter.put('/:customerId', userAuth, updateCustomerDetails);



export default customerDetailsRouter;