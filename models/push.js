var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
// postcommits may have multiple commits, so we split them out
var Push = new mongoose.Schema({}); // no schema, store whatever Github sends us

module.exports = mongoose.model('Push', Push);