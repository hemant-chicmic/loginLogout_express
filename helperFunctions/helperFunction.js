

import fs from 'fs/promises';
import jwt from 'jsonwebtoken' ; 

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';





const filepath = fileURLToPath(import.meta.url);
const __dirname = dirname(filepath);
const userDetailFile = resolve(__dirname, '../database/allUserDetails.json');




export async function readAllUserDetailsDataFile() {
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

export async function saveAllUserDetailsData(allUserDetailsData) {
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



export function generateAccessToken(jwtPayloadObject) 
{
    return jwt.sign(jwtPayloadObject, process.env.TOKEN_SECRET, { algorithm: 'HS256' , expiresIn: '300s' });
}


// export function checkPassword(password)
// {
//     if( ! password || password.length < 3 || password.length > 20 ) return false ;
//     const specialCharacter = "@!#$%^&*()><.,?"
//     const anyNumbers = "1234567890" ;
//     let i = 0 ; 
//     for(i=0; i<specialCharacter.length; i++) if( password.includes(specialCharacter[i])  ) break ;
//     if( i == specialCharacter.length ) return false ;
//     for(i=0; i<anyNumbers.length; i++)  if( password.includes(anyNumbers[i]) ) return true ;
//     return false ; 
// }



