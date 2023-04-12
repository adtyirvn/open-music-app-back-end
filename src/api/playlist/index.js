const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'notes',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    // initiate class handler as notesHandler object with service parameter for logic in handler
    const playlistHandler = new PlaylistHandler(service, validator);
    // function routes using object from notesHandler
    server.route(routes(playlistHandler));
  },
};
