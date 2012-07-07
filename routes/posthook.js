var async = require('async');

var Push = require('../models/push.js');
var DailyCount = require('../models/dailycount.js');
var AuthorCount = require('../models/authorcount.js');

module.exports = function(req, res) {
  // store whatever github sends us
  var push = new Push( JSON.parse(req.body.payload) );
  push.getCommits(function(commits) {
    async.forEach(
      commits
    , function(commit, done) {
        commit.countPatterns().save(function(err, commit){ done() });
      }
    , function(err) {
        AuthorCount.generate(function(err, results) {console.log("Updated AuthorCounts")});
        DailyCount.generate(function(err, results) {console.log("Updated DailyCounts")});
      }
    );
  });
  push.save();

  res.send("ok"); // okey dokey smokey
}