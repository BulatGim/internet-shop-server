const {Dialogs, Messages} = require("../models/models");
const ApiError = require("../error/apiError");
const jwt = require("jsonwebtoken");


function getUser(req) {
    const currentToken = req.headers.authorization.split(' ')[1];
    const user = jwt.decode(currentToken, process.env.SECRET_KEY);
    return user;
}

class DialogController {
    async create(req,res, next){
        const user = getUser(req);
        const {title, description} = req.body;
        if (!title || !description){
            return next(ApiError.badRequest("You cannot create dialog without text"));
        }
        const dialog = await Dialogs.create({userId: user.id})
        const userDialogsTitle = await Messages.findOne({where: {title:title, userId: user.id}})
        console.log(userDialogsTitle)
        if (userDialogsTitle){
            return next(ApiError.badRequest("You have same dialog, please write in same dialog"))
        }
        const message = await Messages.create({title, description, userId: user.id, dialogId: dialog.id});
        return res.json(message);
    }
    async getAll(req,res){
        const user = getUser(req).id;
        const dialogs = await Dialogs.findAll({where:{userId: user}});
        for (let i = 0; i < dialogs.length; i++) {
            const messages = await Messages.findAll({where: {dialogId: dialogs[i].id}});
            let reversedMessages = messages.reverse();
            dialogs[i].dataValues.lastMessage = reversedMessages[0].description;
            dialogs[i].dataValues.title = reversedMessages[0].title;
            dialogs[i].dataValues.lasMessageDate = reversedMessages[0].createdAt;
        }
        return res.json(dialogs)
    }
    async destroy(req,res){
        const {userId} = req.body;
        let deleted = await Dialogs.destroy({where: {userId}})
        return res.json(deleted)
    }
}

module.exports = new DialogController();