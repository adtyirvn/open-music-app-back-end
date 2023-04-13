const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong(songId, playlistId) {
    const id = `pls-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1,$2,$3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Playlist Song gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifySong(songId) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(
        'Gagal menambahkan SongId. SongId tidak ditemukan'
      );
    }
  }
}
module.exports = PlaylistSongService;
