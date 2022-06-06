const {Promotion, Device, Rating} = require("../models/models");
const ApiError = require("../error/apiError");

class PromotionController {
    async create(req,res, next){
        try {
            const {promotionValue, deviceId} = req.body;
            const promotion = await Promotion.create({promotionValue, deviceId});
            const device = await Device.findOne({id: deviceId});
            await Device.update({newPrice: device.price-promotionValue},{where: {id: deviceId}});
            return res.json(promotion);
        }catch (error) {
            next(ApiError.badRequest(error.message))
        }

    }
    async getAll(req,res){
        const promotion = await Promotion.findAll();
        let devices = [];
        let device;
        for (let i = 0; i < promotion.length; i++){
            device = await Device.findOne({where:{id: promotion[i].deviceId}});
            devices.push(device);
        }
        return res.json(devices);
    }
    async put(req,res){
        const {id, promotionValue} = req.body;
        await Promotion.update({ promotionValue: promotionValue }, {
            where: {
            id: id
            }
        })
        const promotion = await Promotion.findOne({where:{id}})
        return res.json(promotion)
    }
    async delete(req,res){
        const {id} = req.body; 
        const detetedPromotion = await Promotion.findOne({where: {id: id}})
        const promotion = await Promotion.destroy({where: {id: id}})
        return res.json(detetedPromotion)
    }
}

module.exports = new PromotionController();