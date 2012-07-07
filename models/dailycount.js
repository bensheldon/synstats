var async       = require('async')
  , request     = require('request')
  , querystring = require('querystring');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Commit = require('./commit.js');

var DailyCount = new mongoose.Schema({}); 

DailyCount.statics.generate = function (callback) {

  var mapFunction = function() { //map function
    if (this.date) {
      var day = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
      emit({"date": day}, {"patterns": this.patterns, "commits": 1});
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

    return {"date": values[0].date, "commits": commits, "patterns": patterns};
  };

  Commit.collection.mapReduce(
    mapFunction.toString()
  , reduceFunction.toString()
  , { query: {}, out: "dailycounts" }
  , callback
  );
}

module.exports = mongoose.model('DailyCount', DailyCount);