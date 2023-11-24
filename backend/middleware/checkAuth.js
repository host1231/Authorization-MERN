const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = (req.headers.authorization.replace(/Bearer\s?/, '') || '');

    if (token) {
        try {
            const decode = jwt.verify(token, 'secret123');
            req.body.userId = decode._id;
            next()
        } catch(err) {
            console.log(err);
            return res.status(500).json({
                message: 'Нет доступа'
            })
        }
    } else {
        return res.status(500).json({
            message: 'Нет доступа'
        })
    }
}   