var Manager = require("dl-module").managers.production.finishingPrinting.KanbanManager;
var JwtRouterFactory = require("../../jwt-router-factory");
var resultFormatter = require("../../../result-formatter");
var db = require("../../../db");
const apiVersion = '1.0.0';

var handlePdfRequest = function(request, response, next) {
    var filename = request.kanban.productionOrder.orderNo + " - " + request.kanban.cart.cartNumber;
    request.manager.pdf(request.kanban)
        .then(kanbanDocBinary => {
            response.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${filename}.pdf`,
                'Content-Length': kanbanDocBinary.length
            });
            response.end(kanbanDocBinary);
        })
        .catch(e => {
            var error = resultFormatter.fail(apiVersion, 400, e);
            response.send(400, error);
        });
};

function getRouter() {
    var router = JwtRouterFactory(Manager, {
        version: apiVersion,
        defaultOrder: {
            "_updatedDate": -1
        }
    });

    var route = router.routes["get"].find(route => route.options.path === "/:id");
    route.handlers[route.handlers.length - 1] = function(request, response, next) {
        var manager;

        db.get()
            .then(db => {
                manager = new Manager(db, request.user);
                return manager.getSingleByIdOrDefault(request.params.id);
            })
            .then((kanban) => {
                var isPDFRequest = (request.headers.accept || '').toString().indexOf("application/pdf") >= 0;
                if (isPDFRequest){
                    request.manager = manager;
                    request.kanban = kanban;
                    next();
                }
                else{
                    var result = getResult(kanban);
                    response.send(result.statusCode, result);
                }
            })
            .catch((e) => {
                var statusCode = 500;
                if (e.name === "ValidationError")
                    statusCode = 400;
                var error = resultFormatter.fail(apiVersion, statusCode, e);
                response.send(statusCode, error);
            });
    };
    route.handlers.push(handlePdfRequest);
    return router;
}

function getResult(kanban){
    var result;
    if (!kanban)
        result = resultFormatter.fail(apiVersion, 404, new Error("data not found"));
    else 
        result = resultFormatter.ok(apiVersion, 200, kanban);
    return result;
}

module.exports = getRouter;
