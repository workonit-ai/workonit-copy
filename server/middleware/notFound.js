function notFound(req, res, next) {
    let err = new Error(`the requested route ${req.originalUrl} could not be found`);
    err.status = 404;
    next(err);
}

module.exports = notFound
