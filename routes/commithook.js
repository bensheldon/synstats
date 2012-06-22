// var async = require('async');

var Commit = require('../models/commit.js');

module.exports = function(req, res) {
  var commit = new Commit({
    raw: req.body
  });
  commit.save();

  console.log(req.body);
  res.send(JSON.stringify(req.body)); // just display the post
}