//SET ROUTER DISINI
var windingQualitySamplingRouter = require('../src/routers/v1/spinning/winding/winding-quality-sampling-router');
var windingMachingByUnitRouter = require('../src/routers/v1/spinning/winding/machine-by-unit-router');
var windingQualitySamplingReportRouter = require('../src/routers/v1/spinning/winding/reports/winding-quality-sampling-report-router');


//WINDING PRODUCTION OUTPUT
var windingProductionOutputByUserRouter = require('../src/routers/v1/spinning/winding/winding-production-output/winding-production-output-by-user-router');
var lotMachineByProductMachineRouter = require('../src/routers/v1/spinning/winding/winding-production-output/lot-machine-by-product-machine-router');
var dailySpinningProductionReportRouter = require('../src/routers/v1/spinning/winding/reports/daily-spinning-production-report-router');


//PRODUCTION ORDER
var productionOrderRouter = require('../src/routers/v1/finishing-printing/production-order-router');
var materialByProcessTypeRouter = require('../src/routers/v1/finishing-printing/material-by-process-type-router');
var constructionByMaterialProcessTypeRouter = require('../src/routers/v1/finishing-printing/construction-by-material-process-type-router');


module.exports = function(server) {
    windingQualitySamplingRouter().applyRoutes(server,                        "/spinning/winding/winding-quality-samplings");
    windingMachingByUnitRouter().applyRoutes(server,                          "/spinning/winding/machine-by-units");
    windingQualitySamplingReportRouter().applyRoutes(server,                  "/spinning/winding/reports/winding-quality-samplings");
    
    windingProductionOutputByUserRouter().applyRoutes(server,                 "/spinning/winding/production-outputs/by-user");
    lotMachineByProductMachineRouter().applyRoutes(server,                    "/spinning/winding/search-lots");
    dailySpinningProductionReportRouter().applyRoutes(server,                 "/spinning/winding/reports/daily-production");
    
    productionOrderRouter().applyRoutes(server,                               "/finishing-printing/production-orders");
    materialByProcessTypeRouter().applyRoutes(server,                         "/finishing-printing/material-by-process-types");
    constructionByMaterialProcessTypeRouter().applyRoutes(server,             "/finishing-printing/construction-by-material-process-types");
};
