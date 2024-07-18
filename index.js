

import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandlerMiddleware.js';
import { userRouter } from './routes/userRoutes.js';



dotenv.config();

const app = express() ; 
const PORT = process.env.PORT || 3000 ;  



app.use(express.json());
app.use('', userRouter);



// Error handling middleware
app.use(errorHandler);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});





        




































