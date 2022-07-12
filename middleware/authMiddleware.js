const jwt = require('jsonwebtoken')

module.exports = function (req,res,next){
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        console.log(req.headers.authorization)
        const token = req.headers.authorization.split(' ')[1] //Bearer ava;ivn;v
        if (!token) {
            return res.status(401).json({message: "Пользователь не авторизован"})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded;
        next()
    } catch (e) {
        res.status(401).json({e})
    }
    /* message: "Пользователь не авторизован и какая-то ошибка" */
}