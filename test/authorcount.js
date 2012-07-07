var async       = require('async')
  , request     = require('request')
  , querystring = require('querystring');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

mongoose.connect(process.env.MONGOHQ);


var AuthorCount = require('../models/authorcount.js');

describe('AuthorCount Model', function() {
  //var patterns = require('../patterns');
  
  it('map-reduces properly', function(done) {
    AuthorCount.generate(function(err, results) {
      console.log(results);
      console.log(err)
      done();
    });
  });  
});