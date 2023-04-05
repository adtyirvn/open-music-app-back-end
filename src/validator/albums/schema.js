const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required().min(1900).max(9999),
});

module.exports = { AlbumPayloadSchema };
