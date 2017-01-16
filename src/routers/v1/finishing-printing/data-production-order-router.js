var Router = require('restify-router').Router;
var router = new Router();
var db = require("../../../db");
var ProductionOrderManager = require("dl-module").managers.production.finishingPrinting.ProductionOrder;
var resultFormatter = require("../../../result-formatter");

var passport = require('../../../passports/jwt-passport');
const apiVersion = '1.0.0';

router.get("/", passport, function (request, response, next) {
    db.get().then(db => {
        var manager = new ProductionOrderManager(db, request.user);
        var query = request.queryInfo;
        manager.getDataProductionOrder(query)
            .then(docs => {
                var result = resultFormatter.ok(apiVersion, 200, docs);
                response.send(200, result);
            })
            .catch(e => {
                response.send(500, "gagal ambil data");
            })
    })
        .catch(e => {
            var error = resultFormatter.fail(apiVersion, 400, e);
            response.send(400, error);
        })
});

module.exports = router;