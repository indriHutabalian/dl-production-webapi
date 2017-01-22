var Router = require('restify-router').Router;
var db = require("../../../db");
var ProductionOrderManager = require("dl-module").managers.production.finishingPrinting.ProductionOrderManager;
var resultFormatter = require("../../../result-formatter");
var passport = require('../../../passports/jwt-passport');
const apiVersion = '1.0.0';

function getRouter() {
    var router = new Router();
    router.get("/", passport, function(request, response, next) {
        db.get().then(db => {
                var manager = new ProductionOrderManager(db, request.user);

                var sorting = {
                    "_updatedDate": -1
                };

                var query = request.queryInfo;
                query.order = sorting;
                query.select = [
                    "productionOrders", "_createdBy", "salesContractNo"
                ];
                manager.read(query)
                    .then(docs => {
                        var result = resultFormatter.ok(apiVersion, 200, docs.data);
                        delete docs.data;
                        delete docs.order;
                        result.info = docs;
                        response.send(200, result);
                    })
                    .catch(e => {
                        response.send(500, "gagal ambil data");
                    });
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            });
    });

    var handlePdfRequest = function(request, response, next) {
        db.get().then(db => {
                var manager = new ProductionOrderManager(db, request.user);

                var id = request.params.id;
                var no = request.params.no;
                var dateFormat = "DD MMMM YYYY";
                var locale = 'id-ID';
                var moment = require('moment');
                moment.locale(locale);
                manager.pdf(id, no)
                    .then(docBinary => {
                        manager.getSingleById(id)
                            .then(docs => {
                                var doc = {};
                                for (var i of docs.productionOrders) {
                                    if (i.orderNo == no) {
                                        doc = i;
                                        break;
                                    }
                                }
                                response.writeHead(200, {
                                    'Content-Type': 'application/pdf',
                                    'Content-Disposition': `attachment; filename=${doc.orderNo}.pdf`,
                                    'Content-Length': docBinary.length
                                });
                                response.end(docBinary);
                            })
                            .catch(e => {
                                var error = resultFormatter.fail(apiVersion, 400, e);
                                response.send(400, error);
                            });
                    })
                    .catch(e => {
                        var error = resultFormatter.fail(apiVersion, 400, e);
                        response.send(400, error);
                    });
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            });
    };

    router.get('/:id', passport, (request, response, next) => {
        db.get().then(db => {
                if ((request.headers.accept || '').toString().indexOf("application/pdf") >= 0) {
                    next();
                }
                else {
                    var manager = new ProductionOrderManager(db, request.user);
                    var id = request.params.id;
                    manager.getSingleById(id)
                        .then(doc => {
                            var result = resultFormatter.ok(apiVersion, 200, doc);
                            response.send(200, result);
                        })
                        .catch(e => {
                            var error = resultFormatter.fail(apiVersion, 400, e);
                            response.send(400, error);
                        });
                }
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            });
    }, handlePdfRequest);


    router.get('/:id', passport, (request, response, next) => {
        db.get().then(db => {
            var manager = new ProductionOrderManager(db, request.user);

            var id = request.params.id;

            manager.getSingleById(id)
                .then(doc => {
                    var result = resultFormatter.ok(apiVersion, 200, doc);
                    response.send(200, result);
                })
                .catch(e => {
                    var error = resultFormatter.fail(apiVersion, 400, e);
                    response.send(400, error);
                });

        });
    });

    router.post('/', passport, (request, response, next) => {
        db.get().then(db => {
            var manager = new ProductionOrderManager(db, request.user);

            var data = request.body;

            manager.create(data)
                .then(docId => {
                    response.header('Location', `${request.url}/${docId.toString()}`);
                    var result = resultFormatter.ok(apiVersion, 201);
                    response.send(201, result);
                })
                .catch(e => {
                    var error = resultFormatter.fail(apiVersion, 400, e);
                    response.send(400, error);
                });
        });
    });

    router.put('/:id', passport, (request, response, next) => {
        db.get().then(db => {
            var manager = new ProductionOrderManager(db, request.user);

            var id = request.params.id;
            var data = request.body;

            manager.update(data)
                .then(docId => {
                    var result = resultFormatter.ok(apiVersion, 204);
                    response.send(204, result);
                })
                .catch(e => {
                    var error = resultFormatter.fail(apiVersion, 400, e);
                    response.send(400, error);
                });

        });
    });

    router.del('/:id', passport, (request, response, next) => {
        db.get().then(db => {
            var manager = new ProductionOrderManager(db, request.user);

            var id = request.params.id;
            var no = request.params.no;
            var data = "";
            manager.getSingleById(id).then(doc => {
                for (var i of doc.productionOrders) {
                    if (i.orderNo == no) {
                        data = i;
                        break;
                    }
                }
                manager.delete(data)
                    .then(docId => {
                        var result = resultFormatter.ok(apiVersion, 204);
                        response.send(204, result);
                    })
                    .catch(e => {
                        var error = resultFormatter.fail(apiVersion, 400, e);
                        response.send(400, error);
                    });
            });


        });
    });
    return router;
}


module.exports = getRouter;
