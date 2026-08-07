export const SendResponse = (res, statusCode, success, message, data = null, error = null) => {
    res.status(statusCode).json({
        success: success,
        message: message,
        data: data,
        error: error
    });
};


export const sendResponse = (res, requestState = true, result = null, message = '', code = 200) => {
    const response = {
        success: requestState,
        data: result
    };
    if (message) {
        response.message = message;
    }
    return res.status(code).json(response);
};
