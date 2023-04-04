/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBSongsToModel } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(15);
    console.log(id, title, year, genre, performer, duration, albumId);
    // const id = nanoid(15);
    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query({
      text: 'SELECT * FROM songs',
    });
    return result.rows.map(mapDBSongsToModel);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id=$1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    return result.rows.map[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, album_id=$6 RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
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
