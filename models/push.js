var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Commit = require('./commit.js');

// postcommits may have multiple commits, so we split them out
var Push = new mongoose.Schema({}); // no schema, store whatever Github sends us

/**
 * Generates individual commits from a Push object
 */
Push.methods.generateCommits = function (callback) {
  var thisCommits = this.get('commits');
  var commits = [];

  for (var i=0; i < thisCommits.length; i++) {
  	commits.push(new Commit(thisCommits[i]));
  }

  callback(commits);

  return this;
};

module.exports = mongoose.model('Push', Push);