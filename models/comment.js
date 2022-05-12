const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    require: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
});

module.exports = mongoose.model('comment', commentSchema);
