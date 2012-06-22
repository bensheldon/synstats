var async       = require('async')
  , request     = require('request')
  , querystring = require('querystring');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Commit = require('./commit.js');

// postcommits may have multiple commits, so we split them out
var Push = new mongoose.Schema({}); // no schema, store whatever Github sends us

/**
 * Generates individual commits from a Push object
 */
Push.methods.getCommits = function (callback) {
  var pushCommits = this.get('commits');
  var commits = [];

  async.forEachSeries(
    pushCommits, 
    function(pushCommit, done) {
      // retrieve the full commit via the Github API
      var url = pushCommit.url.replace('https://github.com', 'https://api.github.com/repos').replace('/commit/', '/commits/');
      url += '?' + querystring.stringify({ access_token: process.env.GITHUB_ACCESS_TOKEN });
      request.get(url, function (err, res, body) {
        commits.push(new Commit(JSON.parse(body)));
        done();
      });
    },
    function(err) {
      console.log("Saved", commits.length, "commits.");
      callback(commits);
    }
  );

  return this;
};

module.exports = mongoose.model('Push', Push);