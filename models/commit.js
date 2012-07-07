var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var util = require('util');

var patchPatterns = require('../lib/patchpatterns')
var patterns = require('../patterns.json');

var Commit = new mongoose.Schema({
  sha     : String
, date    : Date
, author  : {}
, message : String
, url     : String
, files   : []
, patterns: {}
});

Commit.index({ sha: 1 }, { unique: true })

Commit.methods.countPatterns = function () {
  var files = this.get('files');
  var patches = [];
  if (util.isArray(files)) {
    for(var i=0; i < files.length; i++) {
      switch(files[i].status) {
        case 'added':
        case 'deleted':
        case 'modified':
          if (files[i].patch) {
            patches.push(files[i].patch);
          }
          break;
      }
    }
    this.set('patterns', patchPatterns(patches));
  }
  return this;
}

module.exports = mongoose.model('Commit', Commit);