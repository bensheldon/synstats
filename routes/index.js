//var async       = require('async');

var Push = require('../models/push.js');

module.exports = function(req, res) {
  res.render('index', 
    { 
      title: 'Synstats'
    }
  );
}