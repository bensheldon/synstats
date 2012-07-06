var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var util = require('util');

var patchPatterns = require('../lib/patchpatterns')
var patterns = require('../patterns.json');

var Commit = new mongoose.Schema({}); // no schema, store whatever Github sends us

Commit.methods.countPatterns = function () {
  var files = this.get('files');
  var patches = [];
  if (util.isArray(files)) {
    var patches = files.map(function(file) { return file.patch; });
    this.set('patterns', patchPatterns(patches));
  }
  return this;
}

module.exports = mongoose.model('Commit', Commit);