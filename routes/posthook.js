// var async = require('async');

var Push = require('../models/push.js');

module.exports = function(req, res) {
  // store whatever github sends us
  var push = new Push( JSON.parse(req.body.payload) );
  push.save();

  res.send("ok"); // okey dokey smokey
}