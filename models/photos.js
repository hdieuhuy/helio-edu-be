const mongoose = require('mongoose');

const photosSchema = new mongoose.Schema({
  file: {},
});

module.exports = mongoose.model('Photos', photosSchema);
