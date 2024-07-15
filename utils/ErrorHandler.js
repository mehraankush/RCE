export const catchHandler = (error, res, code = 500) => {
    console.log("Error ", error.message);
    return res.status(code).json({
        success: false,
        message: error.message,
        error,
    });
};

export const errorHandler = (res, message, code = 400,...args) => {
    console.log("Error :", error.message);
    return res.status(code).json({
        success: false,
        message: message,
        ...args
    });
};
