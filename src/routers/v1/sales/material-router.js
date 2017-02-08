var Router = require('restify-router').Router;
var db = require("../../../db");
var ProductManager = require("dl-module").managers.master.ProductManager;
var resultFormatter = require("../../../result-formatter");
var passport = require('../../../passports/jwt-passport');
const apiVersion = '1.0.0';

function getRouter() {
    var router = new Router();
    router.get("/", passport, function(request, response, next) {
        db.get().then(db => {
                var manager = new ProductManager(db, request.user);
                var sorting = {
                    "_updatedDate": -1
                };
                var query = request.queryInfo.filter.tags;
                var keyword = request.queryInfo.keyword;
                manager.getProductByTags(keyword, query)
                    .then(docs => {
                        var result = resultFormatter.ok(apiVersion, 200, docs.data);
                        delete docs.data;
                        result.info = docs;
                        response.send(200, result);
                    })
                    .catch(e => {
                        response.send(500, "Failed to fetch data.");
                    });
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            });
    });
    return router;
}
module.exports = getRouter;
