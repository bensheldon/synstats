var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Commit = new mongoose.Schema({}); // no schema, store whatever Github sends us

module.exports = mongoose.model('Commit', Commit);