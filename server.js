var express         = require('express')
  , app             = module.exports = express.createServer();
var PORT = process.env.PORT || 3000;

/** Set up the Database **/
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

if (process.env.MONGOHQ) {
  var MONGOHQ = process.env.MONGOHQ;
}
else {
  console.log("missing MONGOHQ environment variable. see sample.env");
}
mongoose.connect(MONGOHQ);
var Push = require('./models/push.js');
var Commit = require('./models/commit.js');
var DailyCount = require('./models/dailycount.js');
var AuthorCount = require('./models/authorcount.js');

// Express Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser());  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
  io.set('log level', 1); // reduce logging
});

app.get('/', require('./routes/index'));
app.post('/posthook', require('./routes/posthook'));

app.listen(PORT, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});