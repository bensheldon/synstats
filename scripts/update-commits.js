var async       = require('async')
  , request     = require('request')
  , querystring = require('querystring');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

mongoose.connect(process.env.MONGOHQ);

var AuthorCount = require('../models/authorcount.js');
var DailyCount = require('../models/dailycount.js');
var Commit = require('../models/commit.js');

var more = true;
var skip = 0;
var limit = 10;

async.whilst(
  function () { 
    console.log('Updating the', (skip), 'th commit.');
    return more; 
  },
  function (whilstDone) {
    Commit.find()
          .where({"files": {"$exists": 1}})
          .limit(limit)
          .skip(skip)
          .run(function(err, commits) {
      
      // if no more, end the whilst;
      if (!commits.length) { more = false; whilstDone(); }
      // go through each commit and save it
      async.forEach(
        commits
      , function(commit, done) {
          commit.countPatterns().save(function(err) {
            if (err) { console.log("Bad commit!", err, commit) };
            done();
          });
        }
      , function(err) {
          skip += limit;
          whilstDone();
        }
      )            
    });
  },
  function (err) {
    // now do our map-reduce counts
    async.series([
      function(done){
        AuthorCount.generate(function(err, results) { if(err) {console.log(err) }; done() });
      },
      function(done){
        DailyCount.generate(function(err, results) { if(err) {console.log(err) }; done() });
      },
    ],
    function(err){
      // Whew! All done.
      console.log('All commits and map-reduce aggregations have been updated!');
      process.exit();
    });
  }
);


// Kill our process if goes too long
var MAXTIME = 120000; // 2 minutes
setTimeout(
  function(){ 
    console.log('Killed collector for running longer than', MAXTIME/1000, 'seconds!');
    process.exit();
  }, MAXTIME); // kill after 2 minutes