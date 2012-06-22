var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Patterns = require('../patterns.json');

var Commit = new mongoose.Schema({}); // no schema, store whatever Github sends us

Commit.methods.countPatterns = function (callback) {

}

module.exports = mongoose.model('Commit', Commit);