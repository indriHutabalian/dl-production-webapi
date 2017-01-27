 var basicTest = require("../../../basic-test-factory");
 basicTest({
     uri: "/finishing-printing/monitoring-specification-machine",
     model: require("dl-models").production.finishingPrinting.MonitoringSpecificationMachine,
     validate: require("dl-models").validator.production.finishingPrinting.monitoringSpecificationMachine,
     util: require("dl-module").test.data.production.MonitoringSpecificationMachine,
     keyword: "code"
 });