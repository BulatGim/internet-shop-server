const {Device, DeviceInfo, Watched, DeviceColor} = require("../models/models");
const ApiError = require("../error/apiError");
const uuid = require("uuid")
const path = require("path")
const jwt = require("jsonwebtoken");

function getUser(req) {
    if (!req.headers.authorization) {
        return null;
    }
    const currentToken = req.headers.authorization.split(' ')[1];
    const user = jwt.decode(currentToken, process.env.SECRET_KEY);
    return user;
}

class DeviceController {
    async create(req,res, next){
        try {
            let {name, price, brandId, typeId, info, colors, amount} = req.body;
            const {img} = req.files;
            let fileName = uuid.v4()+".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const device = await Device.create({name, price, brandId, typeId, img: fileName, amount})
            if (info) {
                info = JSON.parse(info)
                console.log(info)
                info.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                });
            }
            if (colors) {
                colors = JSON.parse(colors)
                colors.forEach(i => {
                    DeviceColor.create({
                        color: i,
                        deviceId: device.id
                    })
                });
            }
            return res.json(device); 
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
        
    }
    async getAll(req,res){
        let {brandId, typeId, limit, page} = req.query
        page = page || 1;
        limit = limit || 12;
        let offset = page*limit - limit;
        let devices;
        if(!brandId && !typeId){
            devices = await Device.findAndCountAll({limit, offset})
        }
        if(!brandId && typeId){
            devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
        }
        if(brandId && !typeId){
            devices = await Device.findAndCountAll({where: {brandId}, limit, offset})
        }
        if(brandId && typeId){
            devices = await Device.findAndCountAll({where: {brandId, typeId}, limit, offset})
        }
        return res.json(devices)
    }
    async getAllToStore(req,res){
        let devices = await Device.findAll()
        res.json({devices})
    }
    async getOne(req,res, next){
        try {
            const {id} = req.params;
            const device = await Device.findOne(
                {
                    where: {id},
                    include: [{model: DeviceInfo, as: 'info'}, {model: DeviceColor}]
                }
            )
            const Colors = await DeviceColor.findAll({where: {deviceId: id}})
            let updatedDevice = {
                ...device.dataValues,
                colors: Colors
            }
            const user = getUser(req);
            if (user != null ){
                const prevWatchedDevice = await Watched.findOne({where: {deviceId: id, userId: user.id}})
                if (!prevWatchedDevice) {
                    const watched = await Watched.create({deviceId: id, userId: user.id})
                }
            }
            return res.json(device);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }
    async update(req,res, next){
        const {id, name, price, description} = req.body;
        if (!id) {
            return next(ApiError.badRequest("id is not defined"))
        }
        const previousDevice = await Device.findOne({where:{id: id}});
        //const previousDeviceDescription = await DeviceInfo.findOne({where:{id: id}})
        if (name) {
            const sameName = await Device.findOne({where:{name: name}});
            if (sameName) {
                return next(ApiError.badRequest("Введеное вами имя не уникально"))
            }
        }
        let newName = name?(name):(previousDevice.name);
        let newPrice = price?(price):(previousDevice.price);
        //let newDescription = description?(description):(previousDeviceDescription);
        await Device.update({ name: newName, price: newPrice }, {where: {id: id}})
        const updatedDevice = await Device.findOne({where:{id: id}});
        //const updatedDescription = await DeviceInfo.update({})
        return res.json({updatedDevice});
    }
    async deleteDevice(req,res, next){
        const {deviceId} = req.body;
        const deviceForDelete = await Device.findOne({where: {id: deviceId}})
        if (!deviceForDelete) {
            return next(ApiError.badRequest("Такого устройства не существует"))
        }
        const deletedDevice = await Device.destroy({where: {id: deviceId}})
        if (!deletedDevice) {
            return next(ApiError.badRequest("Возникла непредвиденная ошибка"))
        }
        return res.json(deviceForDelete);    
    }
}

module.exports = new DeviceController();