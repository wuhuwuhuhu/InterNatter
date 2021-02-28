const Joi = require('joi');
const { number } = require('joi');

module.exports.chatroomSchema = Joi.object({
    chatroom: Joi.object({
        title: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
    }).required()
});