const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token || "";

  if (token) {
    try{
        const decode = jwt.verify(token, 'secret123');
        req.userId = decode._id;
        next();
    } catch(err) {
        console.log(err);
        res.status(501).json({
            message: 'Ошибка доступа'
        });
    }
  } else {
    res.status(500).json({
        message: 'Ошибка доступа'
    });
  }
};
