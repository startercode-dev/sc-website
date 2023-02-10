const AppError = require('./appError');

const handleCastErrorDB = (err) => {
    const message = `invalid ${err.path}: ${err.value}`;
    return new AppError('message', 400);
};

const handleDuplicateFieldDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    return new AppError(`${value} is taken`, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () => {
    new AppError('invalid token, please login again', 401);
};

const handleJWTExpiredError = () => {
    new AppError('expired token, please login again', 401);
};

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            msg: err.message,
            stack: err.stack,
        });
    } else {
        // render error web page
        console.error('ERROR*', err);
        res.status(err.statusCode).render('error', {
            title: 'something went wrong',
            msg: err.message,
        });
    }
};

const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                msg: err.message,
            });
        }
        console.error('ERROR*', err);
        res.status(500).json({
            status: 'error',
            msg: 'Error not from our end, unknown error',
        });
    }

    // render error web page
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'something went wrong',
            msg: err.message,
        });
    }
    console.error('ERROR*', err);
    res.status(err.statusCode).render('error', {
        title: 'something went wrong',
        msg: 'unknown error, please try again',
    });
};

module.exports = (err, req, res, next) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign(err);

        if (error.code === 11000) error = handleDuplicateFieldDB(error);
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, req, res);
    }
};
