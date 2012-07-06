// var async = require('async');

var Push = require('../models/push.js');

module.exports = function(req, res) {
  // store whatever github sends us
  var push = new Push( JSON.parse(req.body.payload) );
  push.getCommits(function(commits) {
    // do something with the commits
    commits.map(function(commit) {
      // pattern matching and counting; then save
      commit.countPatterns().save();
    });
  });
  push.save();

  res.send("ok"); // okey dokey smokey
}