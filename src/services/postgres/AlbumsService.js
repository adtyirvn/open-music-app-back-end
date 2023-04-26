/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
    this._table = 'albums';
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(15)}`;
    const query = {
      text: `INSERT INTO ${this._table} VALUES ($1, $2, $3) RETURNING id`,
      values: [id, name, year],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query(`SELECT * FROM ${this._table}`);
    return result.rows;
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: `SELECT * FROM ${this._table} WHERE id=$1`,
      values: [id],
    };
    const albumResult = await this._pool.query(queryAlbum);
    if (!albumResult.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    const querySongs = {
      text: `SELECT id, title, performer FROM songs WHERE album_id=$1`,
      values: [id],
    };
    const songsResult = await this._pool.query(querySongs);
    return [albumResult.rows[0], songsResult.rows];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: `UPDATE ${this._table} SET name=$1, year=$2 WHERE id = $3 RETURNING id`,
      values: [name, year, id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album, Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM ${this._table} WHERE id = $1 RETURNING id`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
