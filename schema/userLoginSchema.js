

import Joi from "joi";

export const userLoginSchema = Joi.object({
    userName: Joi.string().min(2).max(30),
    email: Joi.string().email(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@]{4,30}$")).required(),
}).xor('userName', 'email');  
















