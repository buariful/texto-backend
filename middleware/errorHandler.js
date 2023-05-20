const ErrorClass = require("../utils/errorClass");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // --------- Wrong JWT and JWT expiration error
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    const mssge =
      "Your Token is invalide or expired. Log in first and try again";
    err = new ErrorClass(mssge, 400);
  }

  //----- mongodb bad id (castError)
  if (err.name === "CastError") {
    err = new ErrorClass(`Invalid path ${err.path}`, 400);
  }

  // --------- mongodb duplicate key error
  if (err.code === 11000) {
    const mssg = `${Object.keys(
      err.keyValue
    )} is in use. Please enter an unique ${Object.keys(err.keyValue)}`;

    err = new ErrorClass(mssg, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
