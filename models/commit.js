var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var Commit = new mongoose.Schema({
      raw	             : {}
});

module.exports = mongoose.model('Commit', Commit);