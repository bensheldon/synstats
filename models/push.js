var async       = require('async')
  , request     = require('request')
  , querystring = require('querystring');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Commit = require('./commit.js');
var AuthorCount = mongoose.model('AuthorCount');
var DailyCount = mongoose.model('DailyCount');

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
        var commit = JSON.parse(body);
        commits.push(new Commit({
          sha     : commit.sha
        , date    : new Date(commit.commit.author.date)
        , author  : commit.author
        , message : commit.commit.message
        , url     : commit.commit.url
        , files   : commit.files
        }));
        done();
      });
    },
    function(err) {
      console.log("Saved", commits.length, "commits.");
      AuthorCount.generate(function(err, results) {});
      DailyCount.generate(function(err, results) {});
      callback(commits);
    }
  );

  return this;
};

module.exports = mongoose.model('Push', Push);