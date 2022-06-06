const {BasketDevice} = require("../models/models");
const jwt = require('jsonwebtoken');

class BasketDeviceController {
    async addToBasket(req,res){
        const {deviceId} = req.body;
        const currentToken = req.headers.authorization.split(' ')[1];
        const basketId = jwt.decode(currentToken, process.env.SECRET_KEY).id;
        const basket_device = await BasketDevice.create({deviceId, basketId})
        return res.json({basket_device}); 
    }
    async getAll(req,res){
        const currentToken = req.headers.authorization.split(' ')[1];
        const basketId = jwt.decode(currentToken, process.env.SECRET_KEY).id;
        const basketDevices = await BasketDevice.findAll({where:{basketId: basketId}});
        return res.json({basketDevices})
    }
    async delete (req,res){
        const {deviceId} = req.body;
        const currentToken = req.headers.authorization.split(' ')[1];
        const basketId = jwt.decode(currentToken, process.env.SECRET_KEY).id;
        const basket_device_destroyed = await BasketDevice.destroy({where: {deviceId: deviceId, basketId: basketId}});
        return res.json(basket_device_destroyed);
    }
}

module.exports = new BasketDeviceController();