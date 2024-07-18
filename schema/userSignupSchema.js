



import Joi from "joi" ; 


export const userSignupSchema = Joi.object({
    name: Joi.string().required(),
    userName: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    age: Joi.number().min(0).max(300),
    address: Joi.string().max(100) ,
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@]{4,30}$")),
    confirmPassword: Joi.ref("password"),
})























