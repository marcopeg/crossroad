"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _hooks = require("@forrestjs/hooks");

var _registerExtension = require("./register-extension");

var _staticHeader = require("./static-header");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require('es6-promise').polyfill();

require('isomorphic-fetch');

var users = [{
  id: 'dv',
  name: 'Darth Vader'
}, {
  id: 'ls',
  name: 'Luke Skywalker'
}];

var _default = (0, _hooks.createHookApp)({
  // trace: true,
  settings: function settings(_ref) {
    var setConfig = _ref.setConfig;
    setConfig('express.port', 6060);
    setConfig('service.url', 'http://localhost:6060');
    setConfig('service.name', 'Service1');
    setConfig('api.endpoint', 'http://localhost:8080/api');
    setConfig('api.token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiU2VydmljZTEiLCJpYXQiOjE1NjU2MTIyMDQsImV4cCI6MzMwOTE2NTQ2MDR9.MpwI6c9WaK4Hu1XZPXoaKKx-24aRMnkG3lomiim_cxQ'); // eslint-disable-line

    setConfig('staticSignature', '123');
  },
  services: [// require('@forrestjs/service-env'),
  require('@forrestjs/service-express')],
  features: [// User's Routes
  // [
  //     '$EXPRESS_ROUTE',
  //     ({ registerRoute }, { getConfig, jwt }) => {
  //         registerRoute.get('/users/:id', [
  //             // validateStaticHeader(getConfig('staticSignature')),
  //             validateRequest(),
  //             (req, res) => res.json(users.find(u => u.id === req.params.id)),
  //         ])
  //         registerRoute.get('/users', [
  //             validateStaticHeader(getConfig('staticSignature')),
  //             validateRequest(),
  //             (req, res, next) => {
  //                 console.log(req.headers['x-grapi-origin'])
  //                 next()
  //             },
  //             (req, res) => res.json(users),
  //         ])
  //     },
  // ],
  // Register the extension at boot time
  ['$START_SERVICE',
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(_ref2, _ref3) {
      var getConfig, jwt;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              getConfig = _ref2.getConfig;
              jwt = _ref3.jwt;
              (0, _registerExtension.registerExtension)({
                endpoint: getConfig('api.endpoint'),
                token: getConfig('api.token'),
                definition: {
                  name: getConfig('service.name') // shouldRunQueries: true,
                  // queries: {
                  //     users: {
                  //         type: 'JSON',
                  //         // args: {
                  //         //     xGrapiOrigin: 'String',
                  //         // },
                  //         resolve: {
                  //             type: 'rest',
                  //             url: `${getConfig('service.url')}/users`,
                  //             headers: {
                  //                 'x-static-signature': getConfig('staticSignature'),
                  //                 'x-grapi-signature': '{{ __meta.signature }}',
                  //                 'x-grapi-origin': '{{ __meta.origin }}',
                  //             },
                  //         },
                  //     },
                  //     name: {
                  //         type: 'String!',
                  //         args: { id: 'String!' },
                  //         resolve: {
                  //             type: 'rest',
                  //             url: `${getConfig('service.url')}/users/{{id}}`,
                  //             headers: {
                  //                 'x-static-signature': getConfig('staticSignature'),
                  //                 'x-grapi-signature': '{{ __meta.signature }}',
                  //             },
                  //             grab: 'name',
                  //         },
                  //     },
                  // },

                } // GRAPI Routing rules
                // this doesn't really protect the service
                // rules: [
                //     { name: 'originNotNull' },
                //     { name: 'originWhiteList', accept: [ 'Service2', 'Service3' ] },
                // ],

              }).then(function () {
                return console.log('Extension successfully registered');
              })["catch"](function (err) {
                return console.log("Failed to register the extension - " + err.message);
              });

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref4.apply(this, arguments);
    };
  }()]]
});

exports["default"] = _default;