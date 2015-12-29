var express = require('express');
var app = express();
var qs = require('querystring');
var fs = require('fs');

app.use(express.static('../_site'));

app.post('/capture', function(req, resp) {
  var body = '';
  req.on('data', function(data) {
    body += data;
  });      
  req.on('end', function () {
    var post = qs.parse(body);
    
    var data = post['data'].split(';base64,')[1];
    var buf = new Buffer(data, 'base64');

    var file_name = 'out/frame_' + post['frame'] + '.png';
    fs.writeFile(file_name, buf, function(err) {
      if (err) {
        resp.writeHead(500, 'Internal Error');
        resp.end();
        return;
      };

      console.log('Saved frame ' + post['frame']);
      resp.writeHead(204, 'No Content');
      resp.end();
    });
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Digital Gallery Server listening at http://%s:%s', host, port);
});
