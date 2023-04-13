const PlaylistSongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'plsylist_songs',
  version: '1.0.0',
  register: async (
    server,
    { playlistSongService, playlistService, validator }
  ) => {
    // initiate class handler as notesHandler object with service parameter for logic in handler
    const playlistSongHandler = new PlaylistSongHandler(
      playlistSongService,
      playlistService,
      validator
    );
    // function routes using object from notesHandler
    server.route(routes(playlistSongHandler));
  },
};
