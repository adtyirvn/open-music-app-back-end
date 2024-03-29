const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
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
    await this._cacheService.delete(`likes:${albumId}`);
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
    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getAlbumLikes({ albumId }) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      const likesRedis = {
        likes: JSON.parse(result),
        redis: true,
      };
      return likesRedis;
    } catch (error) {
      const query = {
        text: `SELECT COUNT(id) AS likes FROM ${this._table} WHERE album_id = $1`,
        values: [albumId],
      };
      const result = await this._pool.query(query);
      const likes = result.rows[0];
      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(likes));
      return likes;
    }
  }

  async verifyAlbum(albumId) {
    const queryAlbum = {
      text: `SELECT id FROM albums WHERE id = $1`,
      values: [albumId],
    };
    const resultAlbum = await this._pool.query(queryAlbum);
    if (!resultAlbum.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async verifyAlbumLike({ userId, albumId }) {
    const queryAlbumLike = {
      text: `SELECT id FROM ${this._table} WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };
    const resultAlbumLike = await this._pool.query(queryAlbumLike);
    if (resultAlbumLike.rowCount) {
      throw new InvariantError('Anda sudah menyukai album ini');
    }
  }
}
module.exports = UserAlbumLikesService;
