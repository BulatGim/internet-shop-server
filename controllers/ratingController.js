const ApiError = require("../error/apiError");
const {Rating, Device, User} = require('../models/models');
const jwt = require('jsonwebtoken');

async function updateInDevice(deviceId){
    const deviceRating = await Rating.findAll({where: {deviceId}});
    let allRates = 0;
    for (let i = 0; i < deviceRating.length; i++) {
        allRates += deviceRating[i].rate;
    }
    const averagedRating = allRates/deviceRating.length;
    await Device.update({ rating: averagedRating,  ratingsNumber: deviceRating.length}, {where: {id: deviceId}});
    /* await Device.update({ }, {where: {id: deviceId}}); */
}

class RatingController{
    async create (req,res, next){
        try {
            const {rate, deviceId, advantages, disadvantages, comment} = req.body;
            const currentToken = req.headers.authorization.split(' ')[1]
            const userId = jwt.decode(currentToken, process.env.SECRET_KEY).id
            const previousRate = await Rating.findOne({where: {userId, deviceId}})
            if (previousRate) {
                return next(ApiError.badRequest("Такой рейтинг уже был вами введен"))
            }
            const rating = await Rating.create({rate,advantages, disadvantages, comment, userId, deviceId})
            await updateInDevice(deviceId)
            return res.json({rating})
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
        
    }
    async getAll (req,res, next){
        const {userId, deviceId} = req.query;
        let ratings;
        if (!userId && !deviceId){
            ratings = await Rating.findAll();
            for (let index = 0; index < ratings.length; index++) {
                const device = await Device.findOne({where: {id: ratings[index].deviceId}})
                const userName = await User.findOne({where: {id: ratings[index].userId}})
                ratings[index].dataValues.deviceTitle = device.name;
                ratings[index].dataValues.devicePrevieew = device.img;
                ratings[index].dataValues.userName = userName.name;
            }
        }else if (userId && !deviceId) {
            let oldRatings = await Rating.findAll({where: {userId: userId}})
            ratings = oldRatings.reverse();
            for (let index = 0; index < ratings.length; index++) {
                const device = await Device.findOne({where: {id: ratings[index].deviceId}})
                ratings[index].dataValues.deviceTitle = device.name;
                ratings[index].dataValues.devicePrevieew = device.img;
            }
        }else if (!userId && deviceId) {
            ratings = await Rating.findAll({where: {deviceId: deviceId}})
        }else {
            next(ApiError.badRequest("Возникла непредвиденная ошибка"))
        }
        return res.json(ratings)
    }
    async getOne (req,res){
        const {id} = req.params;
        const rate = await Rating.findOne({where: {id}})
        return res.json(rate);
    }
    async getInOneDevice(req,res, next){
        try {
            const {id} = req.params;
            let oldRatings = await Rating.findAll({where: {deviceId: id}})
            let ratings = oldRatings.reverse();
            for (let index = 0; index < ratings.length; index++) {
                const userName = await User.findOne({where: {id: ratings[index].userId}})
                const device = await Device.findOne({where: {id: ratings[index].deviceId}})
                ratings[index].dataValues.userName = userName.name;
                ratings[index].dataValues.deviceTitle = device.name;
                ratings[index].dataValues.devicePrevieew = device.img;
            }
            return res.json(ratings);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
    async getReviewsMadeByUser(req, res, next) {
        try {
            const {id} = req.params;
            let oldRatings = await Rating.findAll({where: {userId: id}})
            let ratings = oldRatings.reverse();
            for (let index = 0; index < ratings.length; index++) {
                const device = await Device.findOne({where: {id: ratings[index].deviceId}})
                ratings[index].dataValues.deviceTitle = device.name;
                ratings[index].dataValues.devicePrevieew = device.img;
            }
            return res.json(ratings)
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
    async update (req, res, next){
        const {rate, rateDescription, deviceId, userId} = req.body;
        if (!deviceId||!userId||(!rate&&!rateDescription)) {
            return next(ApiError.badRequest("Возникла непредвиденная ошибка"))
        }
        if (!rateDescription&&rate) {
            await Rating.update({ rate: rate }, {
                where: {
                    deviceId: deviceId,
                    userId: userId
                }
            })
            const updatedRating = await Rating.findOne({where:{deviceId: deviceId, userId: userId}})
            updateInDevice(deviceId);
            return res.json(updatedRating)
        }
        if (rateDescription&&!rate) {
            await Rating.update({ rateDescription: rateDescription }, {
                where: {
                    deviceId: deviceId,
                    userId:userId
                }
            })
            const updatedRating = await Rating.findOne({where:{deviceId: deviceId, userId: userId}})
            return res.json(updatedRating)
        }
        if(rateDescription&&rate){
            await Rating.update({ rateDescription: rateDescription, rate:rate }, {
                where: {
                    deviceId: deviceId,
                    userId:userId
                }
            })
            const updatedRating = await Rating.findOne({where:{deviceId: deviceId, userId: userId}})
            updateInDevice(deviceId);
            return res.json(updatedRating)
        }
    }
    async delete (req,res, next){
        const {id} = req.params;
        if (!id) {
            return next(ApiError.badRequest("вы не указали id"))
        }
        const rating_destroyed = await Rating.destroy({where: {id: id}});
        if (!rating_destroyed) {
            return next(ApiError.badRequest("Возникла непредвиденная ошибка"))
        }
        return res.json(rating_destroyed)
    }
}
module.exports = new RatingController();