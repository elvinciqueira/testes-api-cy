const Joi = require('joi');

export const bodySchema = Joi.object({
  nome: Joi.string(),
  email: Joi.string(),
  password: Joi.string(),
  administrador: Joi.string(),
  _id: Joi.string(),
});

const usuariosSchema = Joi.object({
  quantidade: Joi.number(),
  usuarios: Joi.array().items(bodySchema),
});

export default usuariosSchema;
