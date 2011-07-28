
/**
 * Module dependencies.
 */

require.paths.unshift('./node_modles');

var express = require('express');

var app = module.exports = express.createServer();

var amazon = require('./amazon.js');

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

// Cron Jobs
// Todo: Manage Jobs in Storage when run in  Multi Instance Env
setInterval(function() {amazon.cron();}, 1000 * 60 * 15);

// Routes

app.get('/', function(req, res){
  amazon.list(function(asins) {
      res.render('index', {
        title: 'Amazon Listing Monitor',
        asins: asins
      });
  });
});

app.get('/asin/:asin', function(req, res, next) {
  amazon.addAsin(req.params.asin, 'us');
  res.send();
  //res.send(amazon.fetch('B0002L5R78', 'us'));
  //res.send('asin' + req.params.asin);
});

app.get('/asins/:asins', function(req, res, next) {
  req.params.asins.split(',').forEach(function(val, index){
    amazon.addAsin(val, 'us');
  });
  res.send();
});

app.get('/view/:id', function(req, res, next) {
  amazon.view(req.params.id, function(docs){
    res.render('view', {
      title: 'Listing and BuyBox History',
      listing: docs
    });
  });
});

app.listen(process.env.VCAP_APP_PORT || 8001);
console.log("Express server listening on port %d", app.address().port);
