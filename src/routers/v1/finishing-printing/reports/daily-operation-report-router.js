var Router = require('restify-router').Router;
var router = new Router();
var db = require("../../../../db");
var DailyOperationManager = require("dl-module").managers.production.finishingPrinting.DailyOperation;
var resultFormatter = require("../../../../result-formatter");

var passport = require('../../../../passports/jwt-passport');
const apiVersion = '1.0.0';

router.get("/", passport, function (request, response, next) {
    db.get().then(db => {
        var manager = new DailyOperationManager(db, request.user);
        var sdate = request.params.dateFrom ? request.params.dateFrom : null;
        var edate = request.params.dateTo ? request.params.dateTo : null;
        var machine = request.params.machine ? request.params.machine : null;
        manager.getDailyOperationReport(sdate, edate, machine)
            .then(docs => {
                    var dateFormat = "DD MMM YYYY";
                    var locale = 'id';
                    var moment = require('moment');
                    moment.locale(locale);
                    if ((request.headers.accept || '').toString().indexOf("application/xls") < 0) {
                        for(var a in docs)
                        {
                            var reportDate = new Date(docs[a].dateOutput);
                            var hourOutput = ('0' + (reportDate.getHours())).slice(-2);
                            var minuteOutput = ('0' + (reportDate.getMinutes())).slice(-2);
                            docs[a].dateOutput = reportDate.getFullYear() == 1900 ? "-" : moment(new Date(docs[a].dateOutput)).format(dateFormat);
                            docs[a]["hourOutput"] = `${hourOutput} : ${minuteOutput}`;
                            var reportDate = new Date(docs[a].dateInput);
                            var hourInput = ('0' + (reportDate.getHours())).slice(-2);
                            var minuteInput = ('0' + (reportDate.getMinutes())).slice(-2);
                            docs[a].dateInput = moment(new Date(docs[a].dateInput)).format(dateFormat);
                            docs[a]["hourInput"] = `${hourInput} : ${minuteInput}`;
                        }
                        var result = resultFormatter.ok(apiVersion, 200, docs);
                        response.send(200, result);
                    }else{
                        var data = [];
                        var index = 0;
                        var steps;
                        for(var dailyOperation of docs){
                            index++;
                            var reportDateInput = new Date(dailyOperation.dateInput);
                            var hourInput = ('0' + (reportDateInput.getHours())).slice(-2);
                            var minuteInput = ('0' + (reportDateInput.getMinutes())).slice(-2);
                            var reportDateOutput = new Date(dailyOperation.dateOutput);
                            var hourOutput = ('0' + (reportDateOutput.getHours())).slice(-2);
                            var minuteOutput = ('0' + (reportDateOutput.getMinutes())).slice(-2);
                            var item = {};
                            item["No"] = index;
                            item["No Order"] = dailyOperation.orderNo;
                            item["Mesin"] = dailyOperation.machine;
                            item["Material"] = dailyOperation.material;
                            item["Warna"] = dailyOperation.color;
                            item["Lebar Kain (m)"] = dailyOperation.finishWidth;
                            item["No Kereta"] = dailyOperation.kanbanNo;
                            item["Jenis Proses"] = dailyOperation.processType;
                            for(var a of dailyOperation.steps){
                                item[a.key] = a.value;
                            }
                            item["Tanggal Input"] = moment(new Date(dailyOperation.dateInput)).format(dateFormat);
                            item["Jam Input"] = `${hourInput} : ${minuteInput}`;
                            item["Jumlah Input"] = dailyOperation.input;
                            item["Tanggal Output"] = reportDateOutput.getFullYear() == 1900 ? "-" : moment(new Date(dailyOperation.dateOutput)).format(dateFormat);
                            item["Jam Output"] = `${hourOutput} : ${minuteOutput}`;
                            item["BQ"] = dailyOperation.goodOutput;
                            item["BS"] = dailyOperation.badOutput;
                            item["Keterangan BS"] = dailyOperation.badOutputDescription;
                            
                            data.push(item);
                            steps = dailyOperation.steps;
                        }
                        var options = {}
                        options["No"] = "number";
                        options["No Order"] = "string";
                        options["Mesin"] = "string";
                        options["Material"] = "string";
                        options["Warna"] = "string";
                        options["Lebar Kain (m)"] = "string";
                        options["No Kereta"] = "string";
                        options["Jenis Proses"] = "string";
                        for(var a of steps){
                            options[a.key] = "string";
                        }
                        options["Tanggal Input"] = "string";
                        options["Jam Input"] = "string";
                        options["Jumlah Input"] = "number";
                        options["Tanggal Output"] = "string";
                        options["Jam Output"] = "string";
                        options["BQ"] = "number";
                        options["BS"] = "number";
                        options["Keterangan BS"] = "string";
                        if(sdate && edate){
                            response.xls(`Laporan Monitoring Daily Operation Setiap Mesin ${moment(new Date(sdate)).format(dateFormat)} - ${moment(new Date(edate)).format(dateFormat)}.xlsx`, data, options);
                        }
                        else if(!sdate && edate){
                            response.xls(`Laporan Monitoring Daily Operation Setiap Mesin ${moment(new Date(edate)).format(dateFormat)}.xlsx`, data, options);
                        }
                        else if(sdate && !edate){
                            response.xls(`Laporan Monitoring Daily Operation Setiap Mesin ${moment(new Date(sdate)).format(dateFormat)}.xlsx`, data, options);
                        }
                        else
                            response.xls(`Laporan Monitoring Daily Operation Setiap Mesin.xlsx`, data,options);
                    }
            })
            .catch(e => {
                response.send(500, "gagal ambil data");
            })
        })
        .catch(e => {
            var error = resultFormatter.fail(apiVersion, 400, e);
            response.send(400, error);
        })
});

module.exports = router;