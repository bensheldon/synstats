var async = require('async');

var mongoose = require('mongoose');
var Commit = mongoose.model('Commit');
var DailyCount = mongoose.model('DailyCount');
var AuthorCount = mongoose.model('AuthorCount');



module.exports = function(req, res) {
  // an example using an object instead of an array
  async.parallel({
    dailyCounts: function(done){
      DailyCount.find()
                .sort("value.patterns.curly_open.counts.delta", -1)
                .run(function(err, dailyCounts) {
        dailyCounts = dailyCounts.map(function(dailyCount) {
          return dailyCount.toObject();
        });
        done(null, dailyCounts);
      })
    },
    authorCounts: function(done){
      AuthorCount.find()
                 .sort("value.patterns.curly_open.counts.delta", -1)
                 .run(function(err, authorCounts) {
        authorCounts = authorCounts.map(function(authorCount) {
          return authorCount.toObject();
        });
        done(null, authorCounts);
      });
    },
    oldestCommit: function(done) {
      Commit.findOne()
            .sort("date", 1)
            .run(function(err, commit){
       done(null, commit.toObject());
      });
    },
    newestCommit: function(done) {
      Commit.findOne()
            .sort("date", -1)
            .run(function(err, commit){
       done(null, commit.toObject());
      });
    }
  }
  , function(err, results) {
      res.render('index', 
      { 
        title: 'Synstats'
      , authorCounts: results.authorCounts
      , dailyCounts: results.dailyCounts
      , since: results.oldestCommit.date
      , until: results.newestCommit.date
      }
    );
  });
}