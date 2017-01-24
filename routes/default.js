//SET ROUTER DISINI
var windingQualitySamplingRouter = require('../src/routers/v1/spinning/winding/winding-quality-sampling-router');
var windingMachingByUnitRouter = require('../src/routers/v1/spinning/winding/machine-by-unit-router');
var windingQualitySamplingReportRouter = require('../src/routers/v1/spinning/winding/reports/winding-quality-sampling-report-router');


//WINDING PRODUCTION OUTPUT
var windingProductionOutputByUserRouter = require('../src/routers/v1/spinning/winding/winding-production-output/winding-production-output-by-user-router');
var lotMachineByProductMachineRouter = require('../src/routers/v1/spinning/winding/winding-production-output/lot-machine-by-product-machine-router');
var dailySpinningProductionReportRouter = require('../src/routers/v1/spinning/winding/reports/daily-spinning-production-report-router');


//PRODUCTION ORDER
var productionOrderRouter = require('../src/routers/v1/sales/production-order-router');
var materialByOrderTypeRouter = require('../src/routers/v1/sales/material-by-order-type-router');
var constructionByMaterialOrderTypeRouter = require('../src/routers/v1/sales/construction-by-material-order-type-router');
var colorTypeByMaterialOrderTypeConstructionRouter = require('../src/routers/v1/sales/color-type-by-material-order-type-construction-router');

//DAILY OPERATION
var DailyOperationRouter = require('../src/routers/v1/finishing-printing/daily-operation-router');
var DataProductionOrderRouter = require('../src/routers/v1/finishing-printing/data-production-order-router');
var DataColorRouter = require('../src/routers/v1/finishing-printing/data-color-router');
var DailyOperationReportRouter = require('../src/routers/v1/finishing-printing/reports/daily-operation-report-router');

//MONITORING EVENT
var monitoringEventRouter = require('../src/routers/v1/finishing-printing/monitoring-event-router');

module.exports = function(server) {
    windingQualitySamplingRouter().applyRoutes(server,                        "/spinning/winding/winding-quality-samplings");
    windingMachingByUnitRouter().applyRoutes(server,                          "/spinning/winding/machine-by-units");
    windingQualitySamplingReportRouter().applyRoutes(server,                  "/spinning/winding/reports/winding-quality-samplings");
    
    windingProductionOutputByUserRouter().applyRoutes(server,                 "/spinning/winding/production-outputs/by-user");
    lotMachineByProductMachineRouter().applyRoutes(server,                    "/spinning/winding/search-lots");
    dailySpinningProductionReportRouter().applyRoutes(server,                 "/spinning/winding/reports/daily-production");
    productionOrderRouter().applyRoutes(server,                               "/sales/production-orders");
    materialByOrderTypeRouter().applyRoutes(server,                           "/sales/material-by-order-types");
    constructionByMaterialOrderTypeRouter().applyRoutes(server,               "/sales/construction-by-material-order-types");
    colorTypeByMaterialOrderTypeConstructionRouter().applyRoutes(server,      "/sales/color-type-by-material-order-type-constructions");

    DailyOperationRouter().applyRoutes(server,                                "/finishing-printing/daily-operations");
    DataProductionOrderRouter().applyRoutes(server,                           "/finishing-printing/data-production-orders");
    DataColorRouter().applyRoutes(server,                                     "/finishing-printing/data-colors");
    DailyOperationReportRouter().applyRoutes(server,                          "/finishing-printing/reports/daily-operation-report");
    monitoringEventRouter().applyRoutes(server,                               "/finishing-printing/monitoring-events");
};
