const Joi = require('joi');
// using Joi object function for validation schema
const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistSongPayloadSchema };
