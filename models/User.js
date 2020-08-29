const mongoose = require('mongoose');

const userMappingSchema = new mongoose.Schema({
  socket_id: String,
  name: String
});

module.exports = mongoose.model('user', userMappingSchema);