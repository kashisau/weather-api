/**
 * Forecast GET request testing
 * 
 */

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('GET /forecast/[latitude],[longitude]/hourly', function() {
    it("Should report error on invalid latitude", function(done) {
        chai.request(server)
            .get('/forecast/invalid.latitude,-71.0589/hourly')
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });

    it("Should report error on invalid longitude", function(done) {
        chai.request(server)
            .get('/forecast/-33.8700308,invalid.longitude/hourly')
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });

    it("Should exhibit success on valid coordiantes", function(done) {
        this.timeout(5000);
        chai.request(server)
            .get('/forecast/-33.8700308,151.2116687/hourly')
            .end((err, res) => {
                res.should.have.status(200);
                should.exist(res.body.lat);
                should.exist(res.body.long);
                should.exist(res.body.currently);
                should.exist(res.body.hourly);
                done();
            });
    });
});