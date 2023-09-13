'use strict';

var t = require('fastify');
var routes = require('./routes');
var i = require('@fastify/view');
var m = require('@fastify/formbody');
var f = require('ejs');
var n = require('path');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var t__default = /*#__PURE__*/_interopDefault(t);
var i__default = /*#__PURE__*/_interopDefault(i);
var m__default = /*#__PURE__*/_interopDefault(m);
var f__default = /*#__PURE__*/_interopDefault(f);
var n__default = /*#__PURE__*/_interopDefault(n);

const r=t__default.default({logger:!0});r.register(m__default.default),r.register(routes.routes),r.register(i__default.default,{engine:{ejs:f__default.default},root:n__default.default.join(__dirname,"/","views"),viewExt:"ejs"}),r.setErrorHandler((e,p,o)=>(console.error(e),o.status(500).send({message:"Internal server error."})));

exports.app = r;
