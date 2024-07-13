import logger from "../utils/logger.js"


export const loggerMiddleware = (req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
};

