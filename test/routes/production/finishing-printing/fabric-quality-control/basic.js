 var basicTest = require("../../../basic-test-factory");
 basicTest({
     uri: "/finishing-printing/quality-control/fabrics",
     model: require("dl-models").production.finishingPrinting.qualityControl.defect.FabricQualityControl,
     validate: require("dl-models").validator.production.finishingPrinting.qualityControl.defect.fabricQualityControl,
     util: require("dl-module").test.data.production.fabricQualityControl,
     keyword: "code"
 });

 
 