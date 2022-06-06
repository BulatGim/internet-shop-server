const {Messages, Dialogs} = require("../models/models");
const ApiError = require("../error/apiError");
const jwt = require("jsonwebtoken");

function getUser(req) {
    const currentToken = req.headers.authorization.split(' ')[1];
    const user = jwt.decode(currentToken, process.env.SECRET_KEY);
    return user;
}

class MessagesController {
    async create(req,res){
        try {
            const dialogId = req.params.id;
            const {description} = req.body;
            const user = getUser(req);
            const messageWithSameTitle = await Messages.findOne({where:{dialogId:dialogId}});
            let message;
            if (user.role === "ADMIN") {
                message = await Messages.create({dialogId, description, userId: user.id, title:messageWithSameTitle.title});
                await Dialogs.update({addressee: user.id},{where: {id: dialogId}})
            }else if (user.role === "USER"){
                message = await Messages.create({dialogId, description, userId: user.id, title:messageWithSameTitle.title});
            }
            return res.json(message);
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }
    async getDialog(req,res){
        const dialogId = req.params.id;
        const user = getUser(req);
        const messages = await Messages.findAll({where:{dialogId:dialogId, userId: user.id}});
        return res.json(messages)
    }
    async destroy(req,res){
        const {id} = req.body;
        const deleted = await Messages.destroy({where:{id: id}})
        return res.json(deleted)
    }
}

module.exports = new MessagesController();