


export const validateRequest = (schema) => {
    return (req , res , next ) => {
        const result = schema.validate(req.body, { abortEarly: false }); 
        if( result.error )
        {
            return res.status(400).json({
                error:  result.error ,
            });
        }
        if (!req.value) {
            req.value = {};
        }
        req.value.body = result.value; 
        next() ;
    }
}






