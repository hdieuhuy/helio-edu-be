const mongoose = require('mongoose');
const { ROLES } = require('../constants/roles');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    min: 6,
    max: 255,
  },
  lastName: {
    type: String,
    min: 6,
    max: 255,
  },

  email: {
    type: String,
    required: true,
    min: 6,
    max: 225,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  role: {
    type: String,
    default: ROLES.USER,
  },

  active: {
    type: Boolean,
    default: false,
  },

  profile: {
    // normal user
    avatar: {
      type: String,
    },
    address: {
      conutry: {
        type: String,
      },
      city: {
        type: String,
      },
      detail: {
        type: String,
      },
    },

    gender: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    phone: {
      type: String,
    },
    coins: {
      type: Number,
      default: 0,
    },

    // teacher
    follow: {
      type: Number,
      default: 0,
    },
    introduce: {
      type: String,
    },

    subjects: {
      type: [String],
    },
    experience: {
      type: Number,
      default: 0,
    },
  },

  idActive: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('User', userSchema);
