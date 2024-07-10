export const successHandler = (res, data, message = "Success", code = 200) => {
    return res.status(code).json({
        success: true,
        message: message,
        data: data,
    });
};