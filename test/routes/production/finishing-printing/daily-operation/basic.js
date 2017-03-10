 var basicTest = require("../../../basic-test-factory");
 basicTest({
     uri: "/finishing-printing/daily-operations",
     model: require("dl-models").production.finishingPrinting.DailyOperation,
     validate: require("dl-models").validator.production.finishingPrinting.dailyOperation,
     util: require("dl-module").test.data.production.dailyOperation,
     keyword: "code"
 });