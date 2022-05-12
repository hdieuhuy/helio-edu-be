const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  const token = request.header("access_token");

  if (!token)
    return response.status(401).json({
      verifyToken: {
        status: "ERROR",
        message: "Người dùng chưa đăng nhập",
        data: "",
      },
    });

  try {
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (err) {
    return response.status(400).json({
      verifyToken: {
        status: "ERROR",
        message: "Token không hợp lệ",
        data: "",
      },
    });
  }
};
