var async       = require('async')
  , request     = require('request')
  , querystring = require('querystring');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

mongoose.connect(process.env.MONGOHQ);


var Commit = require('./models/commit.js');


var more = true;
var skip = 0;
var limit = 10;

async.whilst(
    function () { 
      console.log('Updating the', (skip), 'th commit.');
      return more; 
    },
    function (done) {
      Commit
            .find()
            .where({"files": {"$exists": 1}})
            .limit(limit)
            .skip(skip)
            .run(function(err, commits) {
        if(!commits.length) {
          more = false;
          done();
        }
        else {
          for(var i = 0; i < commits.length; i++) {
            try {
            commits[i].countPatterns().save();
            }
            catch(err) {console.log(commits[i])} // print out anything that doesn't go in
          }
          skip += limit;
          done();
        }
      })
    },
    function (err) {
      console.log('All commits have been updated');
      process.exit();
    }
);


// Kill our process if goes too long
var MAXTIME = 120000; // 2 minutes
setTimeout(
  function(){ 
    console.log('Killed collector for running longer than', MAXTIME/1000, 'seconds!');
    process.exit();
  }, MAXTIME); // kill after 2 minutes