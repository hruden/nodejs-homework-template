const Joi = require("joi");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const registerSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required().error(new Error("Email is required")),
    password: Joi.string().min(6).required().error(new Error("Set password for user")),
    subscription: Joi.string().valueOf("starter", "pro", "business").default("starter")
})

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const validateSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
})

module.exports = {
    registerSchema,
    loginSchema,
    validateSchema,
}
