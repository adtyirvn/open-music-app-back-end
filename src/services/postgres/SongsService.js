/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBSongToModel } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
    this._table = 'songs';
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(15)}`;
    const query = {
      text: `INSERT INTO ${this._table} VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      values: [id, title, year, performer, genre, duration, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongs({ title = null, performer = null }) {
    if (title && performer) {
      const query = `SELECT id, title, performer FROM ${this._table} WHERE title ILIKE $1`;
      const result = await this._pool.query({
        text: `${query} AND performer ILIKE $2`,
        values: [`%${title}%`, `%${performer}%`],
      });

      return result.rows;
    }
    if (title || performer) {
      const query = `SELECT id, title, performer FROM ${this._table} WHERE title ILIKE $1`;
      const result = await this._pool.query({
        text: `${query} OR performer ILIKE $2`,
        values: [`%${title}%`, `%${performer}%`],
      });

      return result.rows;
    }
    const result = await this._pool.query({
      text: `SELECT id, title, performer FROM ${this._table}`,
    });
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: `SELECT * FROM ${this._table} WHERE id=$1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }
    return result.rows.map(mapDBSongToModel)[0];
  }

  async editSongById(id, { title, year, performer, genre, duration, albumId }) {
    const query = {
      text: `UPDATE ${this._table} SET title=$1, year=$2, performer=$3, genre=$4, duration=$5, album_id=$6 WHERE id = $7 RETURNING id`,
      values: [title, year, performer, genre, duration, albumId, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui song, Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const result = await this._pool.query({
      text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
      values: [id],
    });
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus song, Id song tidak ditemukan');
    }
  }
}

module.exports = SongsService;
