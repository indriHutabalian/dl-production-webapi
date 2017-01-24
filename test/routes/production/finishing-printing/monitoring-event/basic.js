 var basicTest = require("../../../basic-test-factory");
 basicTest({
     uri: "/finishing-printing/monitoring-events",
     model: require("dl-models").production.finishingPrinting.MonitoringEvent,
     validate: require("dl-models").validator.production.finishingPrinting.monitoringEvent,
     util: require("dl-module").test.data.production.monitoringEvent,
     keyword: "code"
 });

 
 