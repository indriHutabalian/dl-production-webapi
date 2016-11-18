function test(name, path) {
    describe(name, function () {
        require(path);
    })
}

var server = require('./server');

before('initialize server', function (done) {
    server
        .then(uri => {
            console.log(uri);
            done();
        })
        .catch(e => done(e));
})



describe('@dl-core-webapi', function () {
    this.timeout(2 * 60000);
    //Master
    test("/v1/master/buyers", "./routers/master/buyer-router-test");
    test("/v1/master/suppliers", "./routers/master/supplier-router-test");
    test("/v1/master/products", "./routers/master/product-router-test");
    test("/v1/master/spareparts", "./routers/master/sparepart-router-test");
    test("/v1/master/textiles", "./routers/master/textile-router-test");
    test("/v1/master/fabrics", "./routers/master/fabric-router-test");
    test("/v1/master/accessories", "./routers/master/accessories-router-test");
    test("/v1/master/general", "./routers/master/general-router-test");
    test("/v1/master/uoms", "./routers/master/uom-router-test");
    test("/v1/master/units", "./routers/master/unit-router-test");
    test("/v1/master/categories", "./routers/master/category-router-test"); 
});
