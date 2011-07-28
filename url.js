var http = require('http');

exports.fetch = function(url, callback) {
  var url = require('url').parse(url);
  console.log(url);
  var fetch = http.get({host: url.host, port: url.port, path: url.path}, function (res){
    var html = '';
    res.on('data', function(chunk) {
      html += chunk.toString();
    });
    res.on('end', function() {
     analyze(html); 
    });
  }).on('error', function(e) {
    console.log('Got error:' + e.message);
  });
}

function analyze(html) {
  var regex = /<tbody class="result">.*?(?:<span class="price">\$([\d\.]+)<\/span>.*?)?(?:<span class="price_shipping">\+ \$([^<>]*)<\/span>.*?)?(?:width="120" alt="([\w\s\-\,\.]+)?".*?)?(?:<a href="[^"]+"><b>([\w\s\-\,\.]*)<\/b><\/a>.*?)?(?:(Fulfillment) by Amazon.*?)?<\/tbody>/ig;
  regex = /<tbody class="result">(.*)<\/tbody>/;
  console.log(regex.exec(html));
  console.log('analyze has done!');
}

function save(html, db) {
 
}

this.fetch('http://www.amazon.com/gp/offer-listing/B0002L5R78/ref=sr_1_1_olp?ie=UTF8&qid=1307937255&sr=8-1&condition=new');
