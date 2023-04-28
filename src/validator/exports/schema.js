const Joi = require('joi');

const ExportEmailPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportEmailPayloadSchema;
