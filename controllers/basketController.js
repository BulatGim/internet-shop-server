const {BasketDevice, Device} = require("../models/models");
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
        let array = [];
        for(let i = 0; i < basketDevices.length;i++){
            let device = await Device.findOne({where: {id: basketDevices[i].deviceId}})
            array.push(device)
        }
        return res.json({array})
    }
    async deleteOne (req, res){
        const deviceId = req.params.id;
        const currentToken = req.headers.authorization.split(' ')[1];
        const basketId = jwt.decode(currentToken, process.env.SECRET_KEY).id;
        const basket_device_destroyed = await BasketDevice.destroy({where: {deviceId: deviceId, basketId: basketId}});
        return res.json(basket_device_destroyed);
    }
    async deleteAll (req,res){
        const currentToken = req.headers.authorization.split(' ')[1];
        const basketId = jwt.decode(currentToken, process.env.SECRET_KEY).id;
        const basket_devices = await BasketDevice.findAll({where: {basketId: basketId}})
        for (let index = 0; index < basket_devices.length; index++) {
            await BasketDevice.destroy({where: {basketId: basket_devices[0].basketId}})
            
        }
        const basket_devices1 = await BasketDevice.findAll({where: {basketId: basketId}})
        /* const basket_device_destroyed = await BasketDevice.destroy({where: {basketId: basketId}}); */
        return res.json(basket_devices1);
    }
}

module.exports = new BasketDeviceController();