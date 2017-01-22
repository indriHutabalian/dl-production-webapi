//SET ROUTER DISINI
var v1WindingQualitySamplingRouter = require('../src/routers/v1/spinning/winding/winding-quality-sampling-router');
var v1WindingMachingByUnitRouter = require('../src/routers/v1/spinning/winding/machine-by-unit-router');
var v1WindingQualitySamplingReportRouter = require('../src/routers/v1/spinning/winding/reports/winding-quality-sampling-report-router');


//WINDING PRODUCTION OUTPUT
var v1WindingProductionOutputByUserRouter = require('../src/routers/v1/spinning/winding/winding-production-output/winding-production-output-by-user-router');
var v1LotMachineByProductMachineRouter = require('../src/routers/v1/spinning/winding/winding-production-output/lot-machine-by-product-machine-router');
var v1DailySpinningProductionReportRouter = require('../src/routers/v1/spinning/winding/reports/daily-spinning-production-report-router');


//PRODUCTION ORDER
var v1ProductionOrderRouter = require('../src/routers/v1/finishing-printing/production-order-router');
var v1MaterialByOrderTypeRouter = require('../src/routers/v1/finishing-printing/material-by-order-type-router');
var v1ConstructionByMaterialOrderTypeRouter = require('../src/routers/v1/finishing-printing/construction-by-material-order-type-router');
var v1ColorTypeByMaterialOrderTypeConstructionRouter = require('../src/routers/v1/finishing-printing/color-type-by-material-order-type-construction-router');

//DAILY OPERATION
var v1DailyOperationRouter = require('../src/routers/v1/finishing-printing/daily-operation-router');
var v1DataProductionOrderRouter = require('../src/routers/v1/finishing-printing/data-production-order-router');
var v1DataColorRouter = require('../src/routers/v1/finishing-printing/data-color-router');
var v1DailyOperationReportRouter = require('../src/routers/v1/finishing-printing/reports/daily-operation-report-router');



module.exports = function(server) {
    v1WindingQualitySamplingRouter().applyRoutes(server,                        "/v1/spinning/winding/winding-quality-samplings");
    v1WindingMachingByUnitRouter().applyRoutes(server,                          "/v1/spinning/winding/machine-by-units");
    v1WindingQualitySamplingReportRouter().applyRoutes(server,                  "/v1/spinning/winding/reports/winding-quality-samplings");
    
    v1WindingProductionOutputByUserRouter().applyRoutes(server,                 "/v1/spinning/winding/production-outputs/by-user");
    v1LotMachineByProductMachineRouter().applyRoutes(server,                    "/v1/spinning/winding/search-lots");
    v1DailySpinningProductionReportRouter().applyRoutes(server,                 "/v1/spinning/winding/reports/daily-production");
    
    v1ProductionOrderRouter().applyRoutes(server,                               "/v1/finishing-printing/production-orders");
    v1MaterialByOrderTypeRouter().applyRoutes(server,                           "/v1/finishing-printing/material-by-order-types");
    v1ConstructionByMaterialOrderTypeRouter().applyRoutes(server,               "/v1/finishing-printing/construction-by-material-order-types");
    v1ColorTypeByMaterialOrderTypeConstructionRouter().applyRoutes(server,      "/v1/finishing-printing/color-type-by-material-order-type-constructions");

    v1DailyOperationRouter().applyRoutes(server,                                "/v1/finishing-printing/daily-operations");
    v1DataProductionOrderRouter().applyRoutes(server,                           "/v1/finishing-printing/data-production-orders");
    v1DataColorRouter().applyRoutes(server,                                     "/v1/finishing-printing/data-colors");
    v1DailyOperationReportRouter().applyRoutes(server,                          "/v1/finishing-printing/reports/daily-operation-report");
};
