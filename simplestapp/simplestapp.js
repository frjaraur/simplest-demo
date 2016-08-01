var args = process.argv.slice(2);
const pg = require('pg')
var http=require('http');
var serverip=require('my-local-ip')()
var servername=require('os').hostname();
var fs = require('fs');
var port=args[0];

var appdate=+new Date();

var config = require('./dbconfig.json');

console.log(config.dbuser + ' ' + config.dbpasswd);
console.log(config.dbhost + ' ' + config.dbname);

const conString = 'postgres://' + config.dbuser + ':' + config.dbpasswd + '@' + config.dbhost + '/' + config.dbname;

http.createServer(function (req, res) {
  if (req.url == "/favicon.ico"){return;}
  fs.readFile('simplestapp.html', 'utf-8', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    //res.writeHead(200, {'Content-Type': 'text/plain'});
    //res.writeHead(200, {'Content-Type': 'text/html'});
    //res.write('<html>\n');
    //res.write('<body>\n');

    var clientip = req.connection.remoteAddress;
    var ipaddr = require('ipaddr.js');
    if (ipaddr.IPv4.isValid(clientip)) {
        clientip=ipaddr.toString();
    } else if (ipaddr.IPv6.isValid(clientip)) {
        var ip = ipaddr.IPv6.parse(clientip);
      if (ip.isIPv4MappedAddress()) {
        clientip=ip.toIPv4Address().toString();
      } else {
        if (ip == "::1"){ip="localhost";}
        clientip=ip;
      }
    } else {
      clientip="Unknown";
    }

    var chartData = [];
    for (var i = 0; i < 7; i++)
        chartData.push(Math.random() * 50);




    var result = data.replace('{{chartData}}', JSON.stringify(chartData));
    result = result.replace('{{SERVERIP}}', serverip);
    result = result.replace('{{SERVERNAME}}', servername);
    result = result.replace('{{CLIENTIP}}', clientip);

    console.log(JSON.stringify(chartData));
    //console.log(data);

    res.write(result);


    //res.end('appserverip: ' + serverip+' appservername: '+hostname+' clientip: '+clientip+'\n');
    res.write('<p>appserverip: ' + serverip+' appservername: '+servername+' clientip: '+clientip+'</p>\n');

    res.write('</body>\n');
    res.write('</html>\n');
    res.end();



    console.log("Request received from " + clientip);

    pg.connect(conString, function (err, client, done) {

      if (err) {
        return console.error('error fetching client from pool', err)
      }
      //client.query('SELEC'INSERT INTO demo VALUES ('+appdate+',quote_literal('+serverip+'),quote_literal('+clientip+'),Now())';T * from demo', function (err, result) {

      var insert='INSERT INTO demo(serverip,clientip,date) VALUES (\''+serverip+'\',\''+clientip+'\',Now())';

      console.log(insert);

        client.query(insert, function (err, result) {
            done()

            if (err) {
              return console.error('error happened during query', err)
            }

            console.log(result.rows[0])
        })
        client.end

    })
  });
}).listen(port);






console.log('[' + appdate + ']  ' + serverip+' - '+servername);

console.log('Server running at http://'+serverip+':'+port+'/');
