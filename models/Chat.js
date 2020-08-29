const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  group_id: String,
  name: String,
  message: String
});

module.exports = mongoose.model('chat', chatSchema);