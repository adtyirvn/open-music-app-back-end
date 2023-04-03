/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service) {
    this._service = service;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }
}
module.exports = AlbumsHandler;
