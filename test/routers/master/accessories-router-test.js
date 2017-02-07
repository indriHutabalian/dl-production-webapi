var should = require('should');
var request = require('supertest');
var uri = `${process.env.IP}:${process.env.PORT}`;

function getData() {
    var Product = require('dl-models').master.Product;
    var Uom = require('dl-models').master.Uom; 

    var now = new Date();
    var stamp = now / 1000 | 0;
    var code = stamp.toString(36);

    var product = new Product();
    
    var uom = new Uom({
        unit: `Meter`
    });

    product.code = code;
    product.name = `name[${code}]`;
    product.price = 50;
    product.description = `description for ${code}`;
    product.uom = uom;
    product.tags = 'Accessories,master';
    product.properties = [];

    return product;
};

it('#01. Should be able to get list', function(done) {
    request(uri)
        .get('/v1/master/products/accessories')
        .expect(200)
        .end(function(err, response) {
            if (err)
                done(err);
            else {
                var result = response.body;
                result.should.have.property("apiVersion");
                result.should.have.property('data');
                result.data.should.instanceOf(Array);
                done();
            }
        });
});

it('#02. should success when create new data', function(done) {
    var data = getData();
    request(uri).post('/v1/master/products/accessories')
        .send(data)
        .end(function(err, res) {
            if (err) {
                done(err);
            }
            else {
                done();
            }
        });

});

var createdData;
it(`#03. should success when update created data`, function(done) {
    request(uri).put('/v1/master/products/accessories')
        .send({
            name: 'Hotline',
            code: 'Test123'
        })
        .end(function(err, res) {
            if (err) {
                done(err);
            }
            else {
                done();
            }
        });
});

var createdId;
it("#04. should success when delete data", function(done) {
    request(uri).del('/v1/master/products/accessories/:id')
        .query({
            _id: createdId
        })
        .end(function(err, res) {
            if (err) {
                done(err);
            }
            else {
                done();
            }
        });
});
