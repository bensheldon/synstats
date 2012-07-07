var async       = require('async')
  , request     = require('request')
  , querystring = require('querystring');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

mongoose.connect(process.env.MONGOHQ);


var DailyCount = require('../models/dailycount.js');

describe('DailyCount Model', function() {
  //var patterns = require('../patterns');
  
  it('map-reduces properly', function(done) {
    DailyCount.generate(function(err, results) {
      console.log(results);
      console.log(err)
      done();
    });
  });  
});