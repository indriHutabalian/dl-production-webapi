var Router = require('restify-router').Router;
var db = require("../../../../db");
var WeavingSalesContractManager = require("dl-module").managers.sales.WeavingSalesContractManager;
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
                return Promise.resolve(new WeavingSalesContractManager(db, user));
            });
    };

    var router = new Router();

    router.get("/", passport, function (request, response, next) {
        var user = request.user;
        var query = request.query;
        query.order = Object.assign({}, defaultOrder, query.order);

        var weavingSalesContractManager = {};
        getManager(user)
            .then((manager) => {
                weavingSalesContractManager = manager;
                return weavingSalesContractManager.getWeavingSalesContractReport(query);
            })
            .then(docs => {
                var result = resultFormatter.ok(apiVersion, 200, docs.data);
                delete docs.data;
                result.info = docs;
                return Promise.resolve(result);
            })
            .then((result) => {
                if ((request.headers.accept || '').toString().indexOf("application/xls") < 0) {
                    response.send(result.statusCode, result);
                }
                else{
                    weavingSalesContractManager.getXls(result, query)
                        .then(xls => {
                            response.xls(xls.name, xls.data, xls.options)
                        });
                }
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