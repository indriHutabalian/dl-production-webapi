var Router = require('restify-router').Router;
var router = new Router();
var db = require("../../../../../db");
var LotMachineManager = require("dl-module").managers.master.LotMachineManager;
var resultFormatter = require("../../../../../result-formatter");

var passport = require('../../../../../passports/jwt-passport');
const apiVersion = '1.0.0';

router.get("/", passport, function (request, response, next) {
    db.get().then(db => {
        var manager = new LotMachineManager(db, request.user);

        var sorting = {
            "_updatedDate": -1
        };
        var _productId = request.params._productId ? request.params._productId : null;
        var _machineId = request.params._machineId ? request.params._machineId : null;

        var query = request.queryInfo;
        query.order = sorting;
        manager.getLotbyMachineProduct(_productId,_machineId)
            .then(docs => {
                var result = resultFormatter.ok(apiVersion, 200, docs);
                response.send(200, result);
            })
            .catch(e => {
                response.send(500, "Failed to fetch data.");
            })
    })
        .catch(e => {
            var error = resultFormatter.fail(apiVersion, 400, e);
            response.send(400, error);
        })
});

module.exports = router;