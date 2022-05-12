/* eslint-disable new-cap */
const express = require('express');

const router = express.Router();

const User = require('../models/users');

/* GET users listing. */
router.get('/', async (_, res) => {
  const allUser = new User.find({});

  res.status(200).json({
    getAllUsers: {
      error: '',
      message: 'Lấy danh sách user thành công',
      data: allUser,
    },
  });
});

module.exports = router;
