var cf = require('cloudfoundry');

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Listing = new Schema({
  asin: {type: String},
  site: {type: String},
  dt: {type: Date},
  listing: {type: String},
  buybox: {type: String}
});
mongoose.model('Listing', Listing);

var Asins = new Schema({
  asin: {type: String},
  site: {type: String}
});
mongoose.model('Asins', Asins);

if (!cf.cloud) {
  var mongoConfig = {};
  mongoConfig.credentials = {'username': '', 'password': '', 'hostname': 'localhost', 'port': 27017, 'db': 'amazon'};
} else {
  var mongoConfig = cf.services['mongodb-1.8'][0];
}

var db;

exports.getDb = function (){
  if (!db) {
    db = mongoose.createConnection("mongo://" + 
                                   mongoConfig.credentials.username + ":" + 
                                   mongoConfig.credentials.password + "@" + 
                                   mongoConfig.credentials.hostname + ":" + 
                                   mongoConfig.credentials.port + "/" + 
                                   mongoConfig.credentials.db);
  }
  return db;
}

exports.closeDb = function () {
  mongoose.disconnect();
}
