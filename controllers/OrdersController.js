const {Orders, OrderDevices} = require("../models/models");
const ApiError = require("../error/apiError");
const jwt = require("jsonwebtoken");

function getUser(req) {
    const currentToken = req.headers.authorization.split(' ')[1];
    const user = jwt.decode(currentToken, process.env.SECRET_KEY);
    return user;
}

class OrdersController {
    async create(req,res, next){
        try {
            let orderDevices = [];
            const {devices} = req.body;
            let user = getUser(req);
            let order = await Orders.create({userId: user.id})
            for (let i = 0; i < devices.length; i++) {
                let orderItem = await OrderDevices.create({deviceId: devices[i], orderId: order.id})
                orderDevices.push(orderItem);
            }
            return res.json(orderDevices);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
         
    }
    async getAll(req,res){
        let user = getUser(req);
        let userOrders = []
        const orders = await Orders.findAll({where: {userId: user.id}});
        for (let i = 0; i < orders.length; i++) {
            let orderDevices = await OrderDevices.findAll({where: {orderId: orders[i].id}})
            userOrders.push(orderDevices)
        }
        return res.json(userOrders)
    }
}

module.exports = new OrdersController();