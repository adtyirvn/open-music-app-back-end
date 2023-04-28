const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor() {
    this._pool = new Pool();
    this._table = 'user_album_likes';
  }

  async addUserAlbumLike({ userId, albumId }) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO ${this._table} VALUES ($1, $2, $3) RETURNING id`,
      values: [id, userId, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Like gagal ditambahkan');
    }
  }

  async deleteAlbumLike({ userId, albumId }) {
    const query = {
      text: `DELETE FROM ${this._table} WHERE user_id = $1 AND album_id = $2 RETURNING id`,
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Like gagal dihapus. Album Id tidak ditemukan');
    }
  }

  async getAlbumLikes({ albumId }) {
    const query = {
      text: `SELECT COUNT(id) AS likes FROM ${this._table} WHERE album_id = $1`,
      values: [albumId],
    };
    const result = await this._pool.query(query);
    return result.rows[0].likes;
  }

  async verifyAlbumLike({ userId, albumId }) {
    const query = {
      text: `SELECT id FROM ${this._table} WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new InvariantError('Anda sudah menyukai album ini');
    }
  }
}
module.exports = UserAlbumLikesService;
