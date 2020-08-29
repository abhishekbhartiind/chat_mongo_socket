const mongoose = require('mongoose');

const groupMappingSchema = new mongoose.Schema({
  user_id: String,
  group_id: String
});

module.exports = mongoose.model('group', groupMappingSchema);