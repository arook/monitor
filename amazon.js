var http = require('http');
var db = require('./db.js');
var _id = null;

exports.cron = function() {
  var asins = db.getDb().model('Asins', 'Asinsdata');
  asins.find({}, function(err, docs){
    for(i in docs) {
      exports.fetch(docs[i].asin, docs[i].site);
    }
  })
}

exports.addAsin = function(asin, site) {
  var asins = db.getDb().model('Asins', 'Asinsdata');
  asins.findOne({asin: asin, site: site}, function(err, data){
    if(!data){
      console.log('new asin');
      new asins({
        asin: asin,
        site: site
      }).save();
    }
  });
}

exports.delAsin = function(asin, site) {
  var asins = db.getDb().model('Asins', 'Asinsdata');
  asins.findOne({asin: asin, site: site}, function(err, data){
    if(data) {
      console.log(data);
      data.remove();
    }
  });
}

exports.list = function(callback) {
  var asins = db.getDb().model('Asins', 'Asinsdata');
  asins.find({}, function(err, docs){
    callback(docs);
  });
}

exports.view = function(_id, callback) {
  var asins = db.getDb().model('Asins', 'Asinsdata');
  asins.findById(_id, function(err, asin){
    var listing = db.getDb().model('Listing', 'Listingdata');
    listing.find({asin: asin.asin, site: asin.site}, function(err, docs){
      callback(docs);
    }); 
  });
}

exports.fetch = function(asin, site) {
  //reset _id
  _id = null;
  switch(site) {
    case 'uk':
      listing_url = 'http://www.amazon.com.uk/gp/offer-listing/' + asin + '/ref=sr_1_1_olp?ie=UTF8&qid=1307937255&sr=8-1&condition=new';
      buybox_url = 'http://www.amazon.com.uk/gp/offer-listing/' + asin + '/ref=sr_1_1_olp?ie=UTF8&qid=1307937255&sr=8-1&condition=new';
      break;
    default:
      listing_url = 'http://www.amazon.com/gp/offer-listing/' + asin + '/ref=sr_1_1_olp?ie=UTF8&qid=1307937255&sr=8-1&condition=new';
      buybox_url = 'http://www.amazon.com/Notebook-Adapter-Battery-compatible-Inspiron/dp/' + asin + '/ref=sr_1_1?ie=UTF8&s=electronics&qid=1283499480&sr=8-1';
  }

  var listing_url = require('url').parse(listing_url), 
    buybox_url = require('url').parse(buybox_url);

  var dt = new Date();

  createEntiry(asin, site, dt, function(id) {
  console.log(id + ' begin!');
  http.get({host: buybox_url.host, port: buybox_url.port, path: buybox_url.path}, function (res){
    var html = '';
    res.on('data', function(chunk) {
      html += chunk.toString();
    });
    res.on('end', function() {
      pushToDb(id, asin, site, dt, 'buybox', html);
      console.log(id + ' ' + asin + ' buybox ' + 'done!');
    });
  }).on('error', function(e) {
    console.log('Got error:' + e.message);
  });

  http.get({host: listing_url.host, port: listing_url.port, path: listing_url.path}, function (res){
    var html = '';
    res.on('data', function(chunk) {
      html += chunk.toString();
    });
    res.on('end', function() {
      pushToDb(id, asin, site, dt, 'listing', html);
      console.log(id + ' ' + asin + ' listing ' + 'done!');
    });
  }).on('error', function(e) {
    console.log('Got error:' + e.message);
  });
  });
}


function createEntiry(asin, site, dt, callback) {
  var Listing = db.getDb().model('Listing', "Listingdata");
  var data = new Listing({
    asin: asin, 
    site: site || 'us',
    dt: dt
  });
  data.save(function(err){
    if (err) {
      throw(err);
    } else {
      callback(data._id); 
    }
  });

}

function pushToDb(id, asin, site, dt, type, html) {
  var Listing = db.getDb().model('Listing', 'Listingdata');

  Listing.findById(id, function(err, data) {
    if (err) {
      throw(err);
    }
    data[type] = html;
    data.save(function(err) {
      if (err) {
        throw(err);
      } else {
        _id = data._id;
      }
    });
  });
}

//this.fetch('B0002L5R78');
//this.delAsin('B004PXYEMI', 'us');
