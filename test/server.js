'use strict';
module.exports = new Promise((resolve, reject) => {
    try {

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


        var v1BuyerRouter = require('./src/routers/v1/master/buyer-router');
        v1BuyerRouter.applyRoutes(server, "/v1/master/buyers");

        var v1SupplierRouter = require('./src/routers/v1/master/supplier-router');
        v1SupplierRouter.applyRoutes(server, "/v1/master/suppliers/");

        var v1ProductRouter = require('./src/routers/v1/master/product-router');
        v1ProductRouter.applyRoutes(server, "/v1/master/products");

        var v1UoMRouter = require('./src/routers/v1/master/uom-router');
        v1UoMRouter.applyRoutes(server, "/v1/master/uoms");

        var v1UnitRouter = require('./src/routers/v1/master/unit-router');
        v1UnitRouter.applyRoutes(server, "/v1/master/units");

        var v1CategoryRouter = require('./src/routers/v1/master/category-router');
        v1CategoryRouter.applyRoutes(server, "/v1/master/categories");

        var v1CurrencyRouter = require('./src/routers/v1/master/currency-router');
        v1CurrencyRouter.applyRoutes(server, "/v1/master/currencies");

        var v1VatRouter = require('./src/routers/v1/master/vat-router');
        v1VatRouter.applyRoutes(server, "/v1/master/vats");

        var v1BudgetRouter = require('./src/routers/v1/master/budget-router');
        v1BudgetRouter.applyRoutes(server, "/v1/master/budgets");

        var v1UnitNiRouter = require('./src/routers/v1/master/division-router');
        v1UnitNiRouter.applyRoutes(server, "/v1/master/divisions");

        server.listen(process.env.PORT, process.env.IP);
        console.log(`server created at ${process.env.IP}:${process.env.PORT}`);
        resolve(`${process.env.IP}:${process.env.PORT}`);
    }
    catch (e) {
        reject(e);
    };
});