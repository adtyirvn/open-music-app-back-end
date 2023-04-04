/* eslint-disable camelcase */
const mapDBSongsToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
}) => ({
  id,
  title,
  performer,
});

module.exports = { mapDBSongsToModel };
