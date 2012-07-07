var async       = require('async')
  , request     = require('request')
  , querystring = require('querystring');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Commit = require('./commit.js');

var AuthorCount = new mongoose.Schema({}); 

AuthorCount.statics.generate = function generate(callback) {

  var mapFunction = function() { //map function
    if (this.author) {
      emit({"login": this.author.login}, {"author": this.author,"patterns": this.patterns, "commits": 1});
    }
  } 

  var reduceFunction = function(key, values) {
    var patterns = values.shift().patterns;
    var commits = 0;

    values.forEach(function(value) {
      commits += value.commits;

      for (var pattern in patterns) {
        patterns[pattern].counts.added += value.patterns[pattern].counts.added;
        patterns[pattern].counts.removed += value.patterns[pattern].counts.removed;
        patterns[pattern].counts.delta += value.patterns[pattern].counts.delta;
      }
    });

    return {"author": values[0].author, "commits": commits, "patterns": patterns};
  };

  Commit.collection.mapReduce(
    mapFunction.toString()
  , reduceFunction.toString()
  , { query: {}, out: "authorcounts" }
  , callback
  );
}

module.exports = mongoose.model('AuthorCount', AuthorCount);