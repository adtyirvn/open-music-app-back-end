const autoBind = require('auto-bind');

class PlaylistSongHandler {
  constructor(playlistSongService, playlistService, validator) {
    this._playlistSongService = playlistSongService;
    this._playlistService = playlistService;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    await this._playlistSongService.verifySong(songId);
    const playlistSongId = await this._playlistSongService.addPlaylistSong(
      songId,
      playlistId
    );
    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan pada Playlist',
      data: {
        playlistSongId,
      },
    });
    response.code(201);
    return response;
  }
}
module.exports = PlaylistSongHandler;
