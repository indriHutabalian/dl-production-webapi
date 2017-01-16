var Router = require('restify-router').Router;
var router = new Router();
var db = require("../../../db");
var DailyOperationManager = require("dl-module").managers.production.finishingPrinting.DailyOperation;
var resultFormatter = require("../../../result-formatter");

var passport = require('../../../passports/jwt-passport');
const apiVersion = '1.0.0';

router.get("/", passport, function (request, response, next) {
    db.get().then(db => {
        var manager = new DailyOperationManager(db, request.user);
        var sorting = {
            "_updatedDate": -1
        };
        var query = request.queryInfo;
        query.order = sorting;
        manager.read(query)
            .then(docs => {
                var result = resultFormatter.ok(apiVersion, 200, docs.data);
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