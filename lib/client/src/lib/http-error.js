
export class HttpError extends Error {
    constructor (message, statusCode = 500) {
        super(message)
        this.statusCode = statusCode
    }

    static createHandler () {
        return (err, req, res, next) => {
            res.statusMessage = err.message || err
            res.status(err.statusCode || 500).end()
        }
    }

    static throw (message, statusCode) {
        throw new HttpError(message, statusCode)
    }
}
