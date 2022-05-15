const express = require('express');
const Joi = require('joi');
const nodemailer = require('nodemailer');

const router = express.Router();

const validateField = (data) => {
  const rule = Joi.object({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    content: Joi.string().required(),
  });

  return rule.validate(data);
};

const sendFeedbackMail = ({ email, name, content }) => {
  return new Promise((res, rej) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASS,
      },
    });

    const message = {
      from: email,
      to: process.env.GOOGLE_USER,
      subject: 'HelioEducation - Đóng góp ý kiến',
      html: `
        <h4>Email người đóng góp: ${email} </h4>
        <h4>Tên người đóng góp: ${name}</h4>
        <p>${content}</p>
        <p>HelioEducation Team</p>
      `,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        rej(err);
      } else {
        res(info);
      }
    });
  });
};

router.post('/', async (req, res) => {
  const { error } = validateField(req.body);

  if (error) {
    return res.status(422).json({
      contact: {
        status: 'ERROR',
        message: 'Các trường thông tin bị sai',
        data: {},
      },
    });
  }

  await sendFeedbackMail(req.body);

  return res.status(200).json({
    contact: {
      status: 'OK',
      message: 'Gửi đánh giá thành công',
      data: {},
    },
  });
});

module.exports = router;
