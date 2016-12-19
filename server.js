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


//WINDING PRODUCTION OUTPUT
var v1WindingProductionOutputByUserRouter = require('./src/routers/v1/spinning/winding/winding-production-output/winding-production-output-by-user-router');
v1WindingProductionOutputByUserRouter.applyRoutes(server,   "/v1/spinning/winding/production-outputs/by-user");

var v1LotMachineByProductMachineRouter = require('./src/routers/v1/spinning/winding/winding-production-output/lot-machine-by-product-machine-router');
v1LotMachineByProductMachineRouter.applyRoutes(server,   "/v1/spinning/winding/search-lots");

var v1DailySpinningProductionReportRouter = require('./src/routers/v1/spinning/winding/reports/daily-spinning-production-report-router');
v1DailySpinningProductionReportRouter.applyRoutes(server,   "/v1/spinning/winding/reports/daily-production");


//PRODUCTION ORDER
var v1ProductionOrderRouter = require('./src/routers/v1/finishing-printing/production-order-router');
v1ProductionOrderRouter.applyRoutes(server,   "/v1/finishing-printing/production-orders");


server.listen(process.env.PORT, process.env.IP);
console.log(`server created at ${process.env.IP}:${process.env.PORT}`)