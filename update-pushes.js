var async       = require('async')
  , request     = require('request')
  , querystring = require('querystring');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

mongoose.connect(process.env.MONGOHQ);

var Push = require('./models/push.js');

var more = true;
var skip = 0;
var limit = 10;

async.whilst(
    function () { 
      console.log('Updating the', (skip), 'th push.');
      return more; 
    },
    function (done) {
      Push.find()
            .limit(limit)
            .skip(skip)
            .run(function(err, pushes) {
        if(!pushes.length) {
          more = false;
          done();
        }
        else {
          for(var i = 0; i < pushes.length; i++) {
            try {
              pushes[i].getCommits(function(commits) {
                // do something with the commits
                commits.map(function(commit) {
                  // pattern matching and counting; then save
                  commit.countPatterns().save();
                });
              });
            }
            catch(err) {console.log(pushes[i])} // print out anything that doesn't go in
          }
          skip += limit;
          done();
        }
      })
    },
    function (err) {
      console.log('All pushes have been updated');
    }
);

// Kill our process if goes too long
var MAXTIME = 120000; // 2 minutes
setTimeout(
  function(){ 
    console.log('Killed collector for running longer than', MAXTIME/1000, 'seconds!');
    process.exit();
  }, MAXTIME); // kill after 2 minutes