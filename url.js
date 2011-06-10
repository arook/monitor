var http = require('http');

exports.fetch = function(url, callback) {
  var url = require('url').parse(url);
  console.log(url);
  var fetch = http.get({host: url.host, port: url.port, path: url.path}, function (res){
    console.log(res.statusCode);
    analyze(res);
  }).on('error', function(e) {
    console.log('Got error:' + e.message);
  });
}

function analyze(html, next) {
  console.log(html);
  console.log('analyze has done!');
}
