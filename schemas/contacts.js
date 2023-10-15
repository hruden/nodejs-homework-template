const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().min(4).max(30).required().email(),
  phone: Joi.string()
    .min(4)
    .max(20)
    .required()
    .pattern(/^\+|\d[\s\d\-\(\)]*\d$/),
  favorite: Joi.boolean().default(false),
});
const updateSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().min(4).max(30).email(),
  phone: Joi.string()
    .min(4)
    .max(20)
    .pattern(/^\+|\d[\s\d\-\(\)]*\d$/),
  favorite: Joi.boolean().default(false),
});
const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})

module.exports = {
  addSchema,
  updateSchema,
  updateFavoriteSchema
};
