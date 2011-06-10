
/**
 * Module dependencies.
 */

require.paths.unshift('./node_modles');

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.get('/asin/:asin', function(req, res, next) {
  var url = require('./url.js');
  res.send(url.fetch(1, 2));
  //res.send('asin' + req.params.asin);
});

app.listen(process.env.VCAP_APP_PORT || 8001);
console.log("Express server listening on port %d", app.address().port);
