 var basicTest = require("../../../basic-test-factory");
 basicTest({
     uri: "/finishing-printing/kanbans",
     model: require("dl-models").production.finishingPrinting.Kanban,
     validate: require("dl-models").validator.production.finishingPrinting.kanban,
     util: require("dl-module").test.data.production.kanban,
     keyword: "code"
 });

 
 