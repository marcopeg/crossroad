"use strict";

exports.__esModule = true;
exports.validateStaticHeader = void 0;

var validateStaticHeader = function validateStaticHeader(value, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$header = _ref.header,
      header = _ref$header === void 0 ? 'x-static-signature' : _ref$header,
      _ref$statusCode = _ref.statusCode,
      statusCode = _ref$statusCode === void 0 ? 400 : _ref$statusCode,
      _ref$statusMessage = _ref.statusMessage,
      statusMessage = _ref$statusMessage === void 0 ? 'Invalid Static Signature' : _ref$statusMessage;

  return function (req, res, next) {
    if (req.headers[header] === value) {
      next();
    } else {
      res.statusMessage = statusMessage;
      res.status(statusCode).end();
    }
  };
};

exports.validateStaticHeader = validateStaticHeader;