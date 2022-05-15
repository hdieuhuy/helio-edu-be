const Joi = require('joi');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const sendConfirmationEmail = (email, hash) => {
  return new Promise((res, rej) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASS,
      },
    });

    const message = {
      from: process.env.GOOGLE_USER,
      to: email,
      subject: 'HelioEducation - Xác nhận tài khoản',
      html: `
        <h3> Xin chào ${email} </h3>
        <p>Chào mừng bạn vào hệ thống của HelioEducation</p>
        <p><a target="_" href="${process.env.DOMAIN}/verify/${hash}">Active link</a></p>
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

const registerValidator = (data) => {
  const rule = Joi.object({
    email: Joi.string().min(6).max(225).required().email(),
    password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{6,20}$/)
      .required(),
  });

  return rule.validate(data);
};

const generateToken = (user, tokenLife) => {
  const token = jwt.sign(
    {
      ...user,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: tokenLife,
    }
  );

  return token;
};

function randomString(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = {
  randomString,
  generateToken,
  registerValidator,
  sendConfirmationEmail,
};
