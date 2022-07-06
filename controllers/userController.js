const ApiError = require("../error/apiError");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models');

const generateJwt = (id, email, role, name)=>{
    return jwt.sign(
        {id: id, email, role, name},
        process.env.SECRET_KEY, 
        {expiresIn: '24h'})
}

function getUser(req) {
    const currentToken = req.headers.authorization.split(' ')[1];
    const user = jwt.decode(currentToken, process.env.SECRET_KEY);
    return user;
}

class UserController {
    async registration(req,res, next){
        try {
            const {name, surname, patronymic, phone, birthday, email, password, role} = req.body;
            if(!email || !password){
                return next(ApiError.badRequest("Некорректный email или пароль"))
            }
            const candidate = await User.findOne({where: {email}})
            if (candidate) {
                return next(ApiError.badRequest("Пользователь с таким e-mail уже существует"))
            }
            let hashedPswrd = await bcrypt.hash(password, 10)
            const user = await User.create({email, role, password: hashedPswrd, name, surname, patronymic, phone, birthday})
            const basket = await Basket.create({userId: user.id})
            const token = generateJwt(user.id, user.email, user.role, user.name,);
            return res.json({token})
        } catch (error) {
            next(ApiError.badRequest(error))
        }
    }
    async login(req,res, next){
        try {
            const {email, password} = req.body;
            const user = await User.findOne({where: {email}})
            if (!user) {
                return next(ApiError.internal('Пользователь не найден'))
            }
            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return next(ApiError.internal('Неверный пароль или логин'))
            }
                const token = generateJwt(user.id, user.email, user.role, user.name,)
                return res.json({token})
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }
    async check(req,res, next){
        const token = generateJwt( req.user.id, req.user.email, req.user.role, req.user.name,)
        return res.json({token})
    }
    async getOneUser(req, res, next){
        let decodedToken = getUser(req);
        let user = await User.findOne({where: {id: decodedToken.id}})
        res.json({user})
    }
    async checkPswrd(req, res, next){
        const {password} = req.body;
        const currentToken = req.headers.authorization.split(' ')[1] //Bearer ava;ivn;v
        const email = jwt.decode(currentToken, process.env.SECRET_KEY).email
        const user = await User.findOne({where: {email}})
        const isPswrd = bcrypt.compareSync(password, user.password);
        return res.json({isPswrd})
    }
    async update(req, res, next){
        let {name, surname, patronymic, phone, birthday, email, password} = req.body;
        const currentToken = req.headers.authorization.split(' ')[1] //Bearer ava;ivn;v
        const oldEmail = jwt.decode(currentToken, process.env.SECRET_KEY).email
        const user = await User.findOne({where: {email:oldEmail}})
        if (!password) {
            password = user.password;
        }else{
            password = await bcrypt.hash(password, 10)
        }
        await User.update({ name, surname, patronymic, phone, birthday, email, password}, {
            where: {
            email: oldEmail
            }
        })
        const updatedUser = await User.findOne({where: {email:email}})
        const token = generateJwt(updatedUser.id, updatedUser.email, updatedUser.role, updatedUser.name,)
        res.json({token})
    }
    /* async update(req, res, next){
        const {oldPassword, newPassword, newEmail} = req.body;
        const currentToken = req.headers.authorization.split(' ')[1] //Bearer ava;ivn;v
        const email = jwt.decode(currentToken, process.env.SECRET_KEY).email
        const user = await User.findOne({where: {email}})
        let comparePassword = bcrypt.compareSync(oldPassword, user.password);
        if (!comparePassword) {
            return next(ApiError.internal('Неверный пароль'))
        }
        if (!newEmail&&newPassword) {
            const hashPswrd = await bcrypt.hash(newPassword, 5)
            await User.update({ password: hashPswrd }, {
                where: {
                email: email
                }
            })
            const newToken = generateJwt(user.id, user.email, user.role)
            return res.json({newToken})
        }else if (newEmail&&!newPassword) {
            if (newEmail == email) {
                return next(ApiError.internal('Нельзя ввести одинаковые почты'))
            }
            await User.update({ email: newEmail }, {
                where: {
                email: email
                }
            })
            const newToken = generateJwt(user.id, user.email, user.role)
            return res.json({newToken})
        }else{
            return next(ApiError.internal('Возникла непредвиденная ошибка'))
        }
    } */
}

module.exports = new UserController();