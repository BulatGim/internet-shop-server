const {Watched, Device} = require("../models/models");
const ApiError = require("../error/apiError");

function getUser(req) {
    if (!req.headers.authorization) {
        return null;
    }
    const currentToken = req.headers.authorization.split(' ')[1];
    const user = jwt.decode(currentToken, process.env.SECRET_KEY);
    return user;
}

class WatchedController {
    async getOne(req,res){
        const user = getUser(req);
        const watchedByOneUser = await Watched.findAll({where:{userId: user.id}});
        let watchedDevices = [];
        for (let i = 0; i < watchedByOneUser.length; i++){
            const device = await Device.findOne({where: {id: watchedByOneUser[i].deviceId}})
            watchedDevices.push(device)
        }
        return res.json(watchedDevices)
    }
}

module.exports = new WatchedController();