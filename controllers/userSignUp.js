
import bcrypt from 'bcrypt' ; 

import { readAllUserDetailsDataFile , saveAllUserDetailsData , generateAccessToken } from '../helperFunctions/helperFunction.js' ; 

const saltRounds = 10;


export async function userSignUp(req, res) 
{
    const newUser = req.body;

    newUser.userName = newUser.userName.toLowerCase();
    const emailParts = newUser.email.split('@');
    emailParts[0] = emailParts[0].toLowerCase();
    newUser.email = emailParts.join('@');

    newUser.localpassword = newUser.password ; 
    newUser.userID = Date.now();
    const allUserDetailsData = await readAllUserDetailsDataFile();
    const isnewUsernameExist = allUserDetailsData.some((user) => user.userName === newUser.userName || user.email === newUser.email);
    if (isnewUsernameExist) 
    {
        res.status(400).json({
            status: 400,
            message: "User email or username already exist",
        });
        return;
    }
    const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
    newUser.password = hashedPassword ; 
    newUser.confirmPassword = hashedPassword ; 

    allUserDetailsData.push(newUser);
    await saveAllUserDetailsData(allUserDetailsData);

    const jwtPayloadObject = {
        userID : newUser.userID ,
        userName : newUser.userName ,
        email : newUser.email
    }
    const jwtToken = generateAccessToken( jwtPayloadObject ) ; 

    res.status(201).json({
        status: 201,
        success: true,
        message: " New user details created successfully",
        user: newUser,
        token : jwtToken
    });
}; 


