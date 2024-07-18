

import bcrypt from 'bcrypt' ; 

import { readAllUserDetailsDataFile , generateAccessToken } from '../helperFunctions/helperFunction.js' ; 




export async function userLogin(req , res)
{
    const requestedUser = req.body ; 
    const checkField = requestedUser.userName || requestedUser.email  ;  
    const allUserDetailsData = await readAllUserDetailsDataFile();
    const userNameIndex = allUserDetailsData.findIndex((user) => user.userName === checkField || user.email === checkField);
    if( userNameIndex == -1 ) 
    {
        res.status(400).json({
            status: 400,
            message: "The username, email is incorrect",
        });
        return;
    }
    const userInDB = allUserDetailsData[userNameIndex] ; 
    const isPasswordMatch = await bcrypt.compare(requestedUser.password, userInDB.password);
    if( ! isPasswordMatch )
    {
        res.status(400).json({
            status: 400,
            message: "Passwords do not match.",
        });
        return;
    }

    const jwtPayloadObject = {
        userID : requestedUser.userID ,
        userName : requestedUser.userName ,
        email : requestedUser.email
    }
    const jwtToken = generateAccessToken( jwtPayloadObject ) ; 

    res.status(200).json({
        status: 200,
        success: true,
        message: "User logged in successfully",
        user: userInDB,
        token : jwtToken
    });
} ; 






