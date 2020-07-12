const jwt = require('jsonwebtoken')

const verifyToken = (request, response, next) => {
    const bearerHeader = request.header('Authorization')
    if (typeof bearerHeader !== 'undefined' && bearerHeader !== '') {
        const bearer = bearerHeader.split('Bearer ')
        const bearerToken = bearer[1]
        token = bearerToken
    } else {
        const data = {
            success: false,
            msg: 'Access denied, You need to login first !'
        }
        response.status(401).send(data)
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_KEY)
        request.user = verified
        next()
    } catch (error) {
        const data = {
            success: false,
            msg: 'Access denied, you need to re-Login'
        }
        response.status(400).send(data)
    }
}

module.exports = verifyToken