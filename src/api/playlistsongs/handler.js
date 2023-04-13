const autoBind = require('auto-bind');

class PlaylistSongHandler {
  constructor(usersService, playlistSongService, playlistService, validator) {
    this._playlistSongService = playlistSongService;
    this._playlistService = playlistService;
    this._usersService = usersService;
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
    await this._playlistSongService.verifyPlaylistSong(songId, playlistId);
    await this._playlistSongService.addPlaylistSong(songId, playlistId);
    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan pada Playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner(id, credentialId);
    const { name } = await this._playlistService.getPlaylistById(id);
    const { username } = await this._usersService.getUserById(credentialId);
    const songs = await this._playlistSongService.getPlaylistSong(id);
    const response = h.response({
      status: 'success',
      data: {
        playlist: {
          id,
          name,
          username,
          songs,
        },
      },
    });
    return response;
  }

  async deletePlaylistSongHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    await this._playlistSongService.deletePlaylistSong(songId, playlistId);
    const response = h.response({
      status: 'success',
      message: 'Song berhasil dihapus pada Playlist',
    });
    return response;
  }
}
module.exports = PlaylistSongHandler;
