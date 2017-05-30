var Router = require('restify-router').Router;
var db = require("../../../../db");
var MonitoringSpecificationMachineManager = require("dl-module").managers.production.finishingPrinting.MonitoringSpecificationMachineManager;
var resultFormatter = require("../../../../result-formatter");

var passport = require('../../../../passports/jwt-passport');
const apiVersion = '1.0.0';

function getRouter() {

    var defaultOrder = {
        "_updatedDate": -1
    };

    var getManager = (user) => {
        return db.get()
            .then((db) => {
                return Promise.resolve(new MonitoringSpecificationMachineManager(db, user));
            });
    };

    var router = new Router();

    router.get("/", passport, function (request, response, next) {
        var user = request.user;
        var query = request.query;
        query.order = Object.assign({}, defaultOrder, query.order);

        var monitoringSpecificationMachineManager = {};
        getManager(user)
            .then((manager) => {
                monitoringSpecificationMachineManager = manager;
                return monitoringSpecificationMachineManager.getMonitoringSpecificationMachineByEvent(query);
            })
            .then(docs => {
                var result = resultFormatter.ok(apiVersion, 200, docs.data);
                delete docs.data;
                result.info = docs;
                return Promise.resolve(result);
            })
            .then((result) => {
                response.send(result.statusCode, result);
            })
            .catch((e) => {
                var statusCode = 500;
                if (e.name === "ValidationError")
                    statusCode = 400;
                var error = resultFormatter.fail(apiVersion, statusCode, e);
                response.send(statusCode, error);
            });
    });
    return router;
}

module.exports = getRouter;