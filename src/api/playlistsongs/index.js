const PlaylistSongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'plsylist_songs',
  version: '1.0.0',
  register: async (
    server,
    { usersService, playlistSongService, playlistService, validator }
  ) => {
    // initiate class handler as notesHandler object with service parameter for logic in handler
    const playlistSongHandler = new PlaylistSongHandler(
      usersService,
      playlistSongService,
      playlistService,
      validator
    );
    // function routes using object from notesHandler
    server.route(routes(playlistSongHandler));
  },
};
