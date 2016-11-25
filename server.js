'use strict';

var restify = require('restify');
restify.CORS.ALLOW_HEADERS.push('authorization');

var passport = require('passport');
var server = restify.createServer();

var json2xls = require('json2xls');
server.use(json2xls.middleware);

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS({
    headers: ['Content-Disposition']
}));

server.use(passport.initialize());
server.use(function (request, response, next) {
    var query = request.query;
    query.order = !query.order ? {} : JSON.parse(query.order);
    query.filter = !query.filter ? {} : JSON.parse(query.filter);
    request.queryInfo = query;
    next();
});

//SET ROUTER DISINI
var v1WindingQualitySamplingRouter = require('./src/routers/v1/spinning/winding/winding-quality-sampling-router');
v1WindingQualitySamplingRouter.applyRoutes(server, "/v1/spinning/winding/winding-quality-samplings");
var v1WindingQualitySamplingRouter = require('./src/routers/v1/spinning/winding/machine-by-unit-router');
v1WindingQualitySamplingRouter.applyRoutes(server, "/v1/spinning/winding/machine-by-units");

var v1WindingQualitySamplingReportRouter = require('./src/routers/v1/spinning/winding/reports/winding-quality-sampling-report-router');
v1WindingQualitySamplingReportRouter.applyRoutes(server, "/v1/spinning/winding/reports/winding-quality-samplings");


server.listen(process.env.PORT, process.env.IP);
console.log(`server created at ${process.env.IP}:${process.env.PORT}`)