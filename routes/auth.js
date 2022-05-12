const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();
const {
  randomString,
  generateToken,
  registerValidator,
  sendConfirmationEmail,
} = require('../utils');

const User = require('../models/users');

router.post('/signup', async (req, res) => {
  const _email = req.body.email;
  const { error } = registerValidator(req.body);
  const checkEmailExist = await User.findOne({ email: _email });

  if (error) {
    return res.status(422).json({
      signUp: {
        status: 'ERROR',
        message: 'Lỗi xử lý trên server',
        data: {},
      },
    });
  }

  if (checkEmailExist) {
    return res.status(422).json({
      signUp: {
        status: 'ERROR',
        error: 'Email đã tồn tại',
        data: {},
      },
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const idActive = randomString(20);

  const user = new User({
    email: _email,
    password: hashPassword,
    idActive,
  });

  await sendConfirmationEmail(_email, idActive);

  try {
    const newUser = await user.save();
    return res.json({
      signUp: {
        status: 'OK',
        error: '',
        data: newUser,
      },
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/signin', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const checkPassword = await bcrypt.compare(req.body.password, user.password);
  const token = generateToken(
    {
      _id: user._id,
      profile: user.profile,
      role: user.role,
      active: user.active,
    },
    {
      expiresIn: 60 * 60 * 24,
    }
  );

  if (!user) {
    return res.status(422).json({
      signIn: {
        STATUS: 'ERROR',
        message: 'Email hoặc mật khẩu không đúng',
        data: {},
      },
    });
  }

  if (!checkPassword) {
    return res.status(422).json({
      signIn: {
        STATUS: 'ERROR',
        message: 'Mẩu khẩu không đúng',
        data: {},
      },
    });
  }

  return res.status(200).json({
    signIn: {
      status: 'OK',
      message: 'Đăng nhập thành công',
      data: {
        token,
      },
    },
  });
});

router.get('/verify/:idActive', async (req, res) => {
  const { idActive } = req.params;

  const user = await User.findOne({
    idActive,
  });

  if (!user) {
    return res.status(200).json({
      verifyAccount: {
        status: 'ERROR',
        message: 'Mã xác thực không đúng',
        data: {},
      },
    });
  }

  User.findByIdAndUpdate(user._id, { active: true }, async (error) => {
    if (error) {
      return res.status(500).json({
        verifyAccount: {
          status: 'ERROR',
          message: 'Lỗi xử lý server',
          data: {},
        },
      });
    }

    return res.status(200).json({
      verifyAccount: {
        status: 'OK',
        message: 'Xác thực thành công',
        data: {},
      },
    });
  });
});

router.get('/sendmail', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(422).json({
      sendMail: {
        status: 'ERROR',
        error: 'Email không tồn tại trong hệ thống',
        data: {},
      },
    });
  }

  const idActive = randomString(20);

  User.findByIdAndUpdate(user._id, { idActive }, async (error) => {
    if (error) {
      return res.status(502).json({
        sendMail: {
          status: 'ERROR',
          message: 'Lỗi xử lý server',
          data: {},
        },
      });
    }

    await sendConfirmationEmail(email, idActive);
    return res.status(200).json({
      sendMail: {
        status: 'OK',
        message: 'Gửi mail thành công',
        data: {},
      },
    });
  });
});

module.exports = router;
