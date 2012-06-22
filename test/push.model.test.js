var sinon = require('sinon')
  , request = require('request');
  
var fs = require('fs');

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOHQ);

describe('Push Model', function(){
  var Push = require('../models/push.js');

  beforeEach(function(done) { 
      // Stub Model.save()
      sinon.stub(mongoose.Model.prototype, 'save', function(callback) {
        callback(this);
      });
      // Stub request
      sinon.stub(request, 'get', function(url, callback) {
        callback(null, {}, JSON.stringify(require("./mocks/commit.json")));
      });
      done();
    });
    
  afterEach(function(done) {
    // clean up our stubs
    mongoose.Model.prototype.save.restore();
    request.get.restore();
    done();
  });
  
  describe('.getCommits()', function() {  
    it("create individual commits from the push", function(done) {
      var payload = require("./mocks/payload.json");
      var push = new Push(payload);

      push.should.have.property('getCommits');

      push.getCommits(function(commits) {
        commits.length.should.equal(3);
        request.get.callCount.should.equal(3); // should call request.get() 3 times (once for each commit)
        commits[0].get('author').login.should.equal("bensheldon");
        done();
      });
    });
    it("returns the original Push object", function(done) {
      var payload = require("./mocks/payload.json");
      var push = new Push(payload);

      push.getCommits( function(commits) {} ).should.have.property('save');
      done();
    });
  });    
});