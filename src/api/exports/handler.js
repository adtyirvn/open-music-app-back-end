const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(ProducerService, playlistService, validator) {
    this._playlistService = playlistService;
    this._ProducerService = ProducerService;
    this._validator = validator;
    autoBind(this);
  }

  async postExportNotesHandler(request, h) {
    console.log(request.payload);
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    this._validator.validateExportEmailPayload(request.payload);
    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    const message = {
      userId: credentialId,
      playlistId,
      targetEmail,
    };
    console.log(message);
    await this._ProducerService.sendMessage(
      'export:playlist',
      JSON.stringify(message)
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
