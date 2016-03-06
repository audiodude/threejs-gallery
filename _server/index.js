var express = require('express');
var app = express();
var qs = require('querystring');
var fs = require('fs');
var exec = require('child_process').exec;

// From http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

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

    var file_name = 'out/frame_' + padDigits(post['frame'], 5) + '.png';
    fs.writeFile(file_name, buf, function(err) {
      if (err) {
        console.error('Error writing %s: %s', file_name, err);
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

app.get('/gif', function(req, resp) {
	exec('ls', function(err, stdout, stderr) {
		resp.write(stdout);
		resp.end();
	});
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Digital Gallery Server listening at http://%s:%s', host, port);
});
