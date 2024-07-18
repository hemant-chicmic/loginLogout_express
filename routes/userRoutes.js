
import express from 'express';

import { authenticateToken } from '../middleware/authMiddleware.js';
import { asyncHandler  } from '../middleware/errorHandlerMiddleware.js';
import {userSignUp} from '../controllers/userSignUp.js' ; 
import {userLogin} from '../controllers/userLogin.js' ; 
import {randomRoute} from '../controllers/randomRoute.js' ; 
import {userUserName} from '../controllers/userUserName.js' ; 
import { userSignupSchema } from '../schema/userSignupSchema.js';
import { userLoginSchema } from '../schema/userLoginSchema.js';
import { validateRequest } from '../validations/validateRequest.js';



const userRouter = express.Router();

// // 
userRouter.get('/', (req, res) => {
    res.send("Hello World");
});

userRouter.post('/userSignUp', validateRequest(userSignupSchema) , asyncHandler(userSignUp));

userRouter.post( '/userLogin' , validateRequest(userLoginSchema) , asyncHandler(userLogin)) ; 

userRouter.get('/user/:userName', authenticateToken , asyncHandler(userUserName));

// // for any random route or url
userRouter.use( randomRoute );


export { userRouter };




