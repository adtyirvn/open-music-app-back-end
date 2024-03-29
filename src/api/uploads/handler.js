const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(albumsService, storageService, validator) {
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._validator = validator;
    autoBind(this);
  }

  async postUploadImageCoverAlbumHandler(request, h) {
    const { id } = request.params;
    await this._albumsService.verifyAlbum(id);
    const { cover } = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    await this._albumsService.addAlbumCover(fileLocation, id);
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}
module.exports = UploadsHandler;
