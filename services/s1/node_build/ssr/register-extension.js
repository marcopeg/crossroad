"use strict";

exports.__esModule = true;
exports.validateRequest = exports.registerExtension = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var query = "\n    mutation reg (\n        $t: String\n        $d: JSON!\n    ) {\n        registerExtension (\n            token: $t\n            definition: $d\n        ) \n    }";
var data = {
  secret: null
};

var registerExtension =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var endpoint, definition, secret, token, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            endpoint = _ref.endpoint, definition = _ref.definition, secret = _ref.secret, token = _ref.token;
            // Generate a new random secret
            data.secret = secret || definition.name + "-" + Date.now(); // Run the GraphQL Request

            res = null;
            _context.prev = 3;
            _context.next = 6;
            return fetch(endpoint, {
              method: 'POST',
              cache: 'no-cache',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                query: query,
                variables: {
                  t: token,
                  d: definition
                }
              })
            });

          case 6:
            res = _context.sent;
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](3);
            throw new Error("fetch failed - " + _context.t0.message);

          case 12:
            if (!(res.status !== 200)) {
              _context.next = 14;
              break;
            }

            throw new Error("request failed - " + res.status + " " + res.statusText);

          case 14:
            _context.prev = 14;
            _context.next = 17;
            return res.json();

          case 17:
            return _context.abrupt("return", _context.sent.data.registerExtensionJSON);

          case 20:
            _context.prev = 20;
            _context.t1 = _context["catch"](14);
            throw new Error("unexpected response format - " + _context.t1.message);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 9], [14, 20]]);
  }));

  return function registerExtension(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.registerExtension = registerExtension;

var validateRequest = function validateRequest(_temp) {
  var _ref3 = _temp === void 0 ? {} : _temp,
      _ref3$header = _ref3.header,
      header = _ref3$header === void 0 ? 'x-grapi-signature' : _ref3$header,
      _ref3$statusCode = _ref3.statusCode,
      statusCode = _ref3$statusCode === void 0 ? 400 : _ref3$statusCode,
      _ref3$statusMessage = _ref3.statusMessage,
      statusMessage = _ref3$statusMessage === void 0 ? 'Invalid GRAPI Signature' : _ref3$statusMessage;

  return function (req, res, next) {
    _jsonwebtoken["default"].verify(req.headers[header], data.secret, function (err) {
      if (err) {
        res.statusMessage = statusMessage;
        res.status(statusCode).end();
      } else {
        next();
      }
    });
  };
};

exports.validateRequest = validateRequest;