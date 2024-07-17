

export function errorHandler(err, req, res, next) {
    console.error(err.stack); 
    res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        error: err.message
    });
}



export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}











