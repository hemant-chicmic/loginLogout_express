
import express from 'express';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import jwt from 'jsonwebtoken' ; 
import dotenv from 'dotenv' ; 
import bcrypt from 'bcrypt' ; 
import { authenticateToken } from './middleware/authMiddleware.js';
import { errorHandler , asyncHandler  } from './middleware/errorHandlerMiddleware.js';




const saltRounds = 10;
dotenv.config();

const filepath = fileURLToPath(import.meta.url);
const __dirname = dirname(filepath);
const userDetailFile = resolve(__dirname, 'allUserDetails.json');

const app = express();
const PORT = process.env.PORT || 3000 ;



app.use(express.json());




async function readAllUserDetailsDataFile() {
    try 
    {
        const fileData = await fs.readFile(userDetailFile, 'utf8');
        if (!fileData.trim()) return [];
        return JSON.parse(fileData);
    } catch (err) 
    {
        console.log("Error in reading the file to get all users:", err);
        return [];
    }
}

async function saveAllUserDetailsData(allUserDetailsData) {
    try 
    {
        const userData = JSON.stringify(allUserDetailsData, null, 4);
        await fs.writeFile(userDetailFile, userData);
    } catch (err) 
    {
        console.log("Error in writing the file to get all users:", err);
        throw err;
    }
}



function generateAccessToken(jwtPayloadObject) 
{
    return jwt.sign(jwtPayloadObject, process.env.TOKEN_SECRET, { algorithm: 'HS256' , expiresIn: '300s' });
}


function checkPassword(password)
{
    if( ! password || password.length < 3 || password.length > 20 ) return false ;
    const specialCharacter = "@!#$%^&*()><.,?"
    const anyNumbers = "1234567890" ;
    let i = 0 ; 
    for(i=0; i<specialCharacter.length; i++) if( password.includes(specialCharacter[i])  ) break ;
    if( i == specialCharacter.length ) return false ;
    for(i=0; i<anyNumbers.length; i++)  if( password.includes(anyNumbers[i]) ) return true ;
    return false ; 
}






app.get('/', (req, res) => {
    res.send("Hello World");
});




app.get('/user/:username', authenticateToken , asyncHandler(async (req, res) => {
    const enteredUsername = req.params.username;
    const allUserDetailsData = await readAllUserDetailsDataFile();
    const user = allUserDetailsData.find((user) => user.userName === enteredUsername);
    if (!user) 
    {
        res.status(400).json({
            status: 400,
            message: "User doesn't exist",
        });
        return;
    }
    res.status(200).json({
        status: 200,
        success: true,
        message: " User details fetched Successfully ",
        user: user ,
    });
}));





// app.get( '/userDetails' , authenticateToken , asyncHandler((req, res) => {
//     res.json({ 
//         message: "You are authorized to access this" ,
//         user : req.user
//     });
// })) ; 




app.post('/createUser', asyncHandler(async (req, res) => {
    const newUser = req.body;
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
    const newUserPassword = newUser.password ;
    const newUserConfirmPassword = newUser.confirmPassword ;
    if( (newUserPassword != newUserConfirmPassword) || !checkPassword(newUserPassword) )
    {
        res.status(400).json({
            status: 400,
            message: "Password and confirmation mismatch, or the password does not meet format requirements. ",
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
}));

app.post( '/userLogin' , asyncHandler(async(req , res) => {
    const requestedUser = req.body ; 
    const checkField = requestedUser.userName || requestedUser.email  ;  
    console.log("reuqest user" , checkField ) ; 
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
        userID : newUser.userID ,
        userName : newUser.userName ,
        email : newUser.email
    }
    const jwtToken = generateAccessToken( jwtPayloadObject ) ; 

    res.status(200).json({
        status: 200,
        success: true,
        message: "User logged in successfully",
        user: userInDB,
        token : jwtToken
    });
})) ; 





app.use( (req, res) => {
    res.status(404).send("This route does not exist. Please check the URL.");
});
 
app.use(errorHandler) ; 


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});






        




































