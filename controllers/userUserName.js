




import { readAllUserDetailsDataFile } from '../helperFunctions/helperFunction.js' ; 


export async function userUserName(req, res) 
{
    const enteredUsername = req.params.userName;
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
}




















