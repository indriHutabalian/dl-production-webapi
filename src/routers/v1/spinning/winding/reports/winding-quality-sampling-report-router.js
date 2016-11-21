var Router = require('restify-router').Router;
var router = new Router();
var db = require("../../../../../db");
var WindingQualitySamplingManager = require("dl-module").managers.production.spinning.winding.WindingQualitySampling;
var resultFormatter = require("../../../../../result-formatter");

var passport = require('../../../../../passports/jwt-passport');
const apiVersion = '1.0.0';

router.get("/", passport, function (request, response, next) {
    db.get().then(db => {
        var manager = new WindingQualitySamplingManager(db, request.user);
        var sdate = request.params.dateFrom ? request.params.dateFrom : null;
        var edate = request.params.dateTo ? request.params.dateTo : null;
        manager.getWindingQualitySamplingReportByDate(sdate, edate)
            .then(docs => {
                    if ((request.headers.accept || '').toString().indexOf("application/xls") < 0) {
                        for(var a in docs)
                        {
                            var u1 = docs[a].U.toFixed(2).toString().split('.');
                            var u2 = u1[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            docs[a].U = u2 + '.' + u1[1];
                            var sys1 = docs[a].sys.toFixed(2).toString().split('.');
                            var sys2 = sys1[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            docs[a].sys = sys2 + '.' + sys1[1];
                            var elongation1 = docs[a].elongation.toFixed(2).toString().split('.');
                            var elongation2 = elongation1[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            docs[a].elongation = elongation2 + '.' + elongation1[1];
                            var ipi1 = docs[a].ipi.toFixed(2).toString().split('.');
                            var ipi2 = ipi1[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            docs[a].ipi = ipi2 + '.' + ipi1[1];
                        }
                        var result = resultFormatter.ok(apiVersion, 200, docs);
                        response.send(200, result);
                    }else{
                        var dateFormat = "DD MMMM YYYY";
                        //var locale = 'id-ID';
                        // var moment = require('moment');
                        // moment.locale(locale);
                        var data = [];
                        var index = 0;
                        for(var spinningProductQuality of docs){
                            index++;
                            var u1 = spinningProductQuality.U.toFixed(2).toString().split('.');
                            var u2 = u1[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            var u = u2 + '.' + u1[1];
                            var sys1 = spinningProductQuality.sys.toFixed(2).toString().split('.');
                            var sys2 = sys1[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            var sys = sys2 + '.' + sys1[1];
                            var elongation1 = spinningProductQuality.elongation.toFixed(2).toString().split('.');
                            var elongation2 = elongation1[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            var elongation = elongation2 + '.' + elongation1[1];
                            var ipi1 = spinningProductQuality.ipi.toFixed(2).toString().split('.');
                            var ipi2 = ipi1[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            var ipi = ipi2 + '.' + ipi1[1];
                            var item = {
                                "No": index,
                                "Mesin" : spinningProductQuality.machine.name,
                                "Jenis Benang" : spinningProductQuality.uster.code,
                                "U%" : u,
                                "Sys" : sys,
                                "Elongation" : elongation,
                                "Total Ipi" : ipi,
                                "Kualifikasi" : spinningProductQuality.grade
                            }
                            data.push(item);
                        }
                        var options = {
                            "No": "number",
                            "Mesin" : "string",
                            "Jenis Benang" : "string",
                            "U%" : "number",
                            "Sys" : "number",
                            "Elongation" : "number",
                            "Total Ipi" : "number",
                            "Kualifikasi" : "string"
                        }
                        if(sdate && edate){
                            response.xls(`Laporan Kualitas Hasil Produksi Spinning ${sdate} - ${edate}.xlsx`, data, options);
                        }
                        else if(!sdate && edate){
                            response.xls(`Laporan Kualitas Hasil Produksi Spinning sampai tanggal ${edate}.xlsx`, data, options);
                        }
                        else if(sdate && !edate){
                            response.xls(`Laporan Kualitas Hasil Produksi Spinning dari tanggal ${sdate}.xlsx`, data, options);
                        }
                        else
                            response.xls(`Laporan Kualitas Hasil Produksi Spinning.xlsx`, data,options);
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