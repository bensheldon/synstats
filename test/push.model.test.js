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
  
  describe('.generateCommits()', function() {  
    it("create individual commits from the push", function(done) {
      var payload = require("./mocks/payload.json");
      var push = new Push(payload);

      push.should.have.property('generateCommits');

      push.generateCommits(function(commits) {
        commits.length.should.equal(3);
        commits[0].get('author').username.should.equal("bensheldon");
        done();
      });
    });
    it("returns the original Push object", function(done) {
      var payload = require("./mocks/payload.json");
      var push = new Push(payload);

      push.generateCommits( function(commits) {} ).should.have.property('save');
      done();
    });
  });    
});