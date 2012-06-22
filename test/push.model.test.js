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
      done();
    });
    
  afterEach(function(done) {
    // clean up our stubs
    mongoose.Model.prototype.save.restore();
    done();
  });
  
  describe('.saveCommits()', function() {  
    it("saves individual commits from the push", function(done) {
      var payload = require("./mocks/payload.json");
      var push = new Push(payload);

      push.should.have.property('saveCommits');

      done();
    });
  });    
});