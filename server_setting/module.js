/**
 * Created by airnold on 15. 7. 15..
 */

var useModule = {};
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var domain = require('express-domain-middleware');
var cors = require('cors');

var johayoJwt = require('johayo-jwt');



var model = require('../model/mongoModel_pre.js');

useModule.express = express;
useModule.path = path;
useModule.favicon = favicon;
useModule.domain = domain;
useModule.logger = logger;
useModule.cookieParser = cookieParser;
useModule.bodyParser = bodyParser;

useModule.johayojwt = johayoJwt;

useModule.cors = cors;


module.exports = useModule;



