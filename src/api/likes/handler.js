const autoBind = require('auto-bind');

class LikesHandler {
  constructor(service) {
    this._service = service;
    autoBind(this);
  }

  async postLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._service.verifyAlbumLike({
      userId,
      albumId,
    });
    await this._service.addUserAlbumLike({
      userId,
      albumId,
    });
    const response = h.response({
      status: 'success',
      message: 'Like berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const likes = await this._service.getAlbumLikes({
      albumId,
    });
    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    return response;
  }

  async deleteLikeHandler(request) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._service.deleteAlbumLike({ userId, albumId });
    return {
      status: 'success',
      message: 'Like berhasil dibatalkan',
    };
  }
}
module.exports = LikesHandler;
