var args = process.argv.slice(2);
const pg = require('pg')
var http=require('http');
var serverip=require('my-local-ip')()
var hostname=require('os').hostname();

var port=args[0];

var appdate=+new Date();

var config = require('./dbconfig.json');

console.log(config.dbuser + ' ' + config.dbpasswd);
console.log(config.dbhost + ' ' + config.dbname);

const conString = 'postgres://' + config.dbuser + ':' + config.dbpasswd + '@' + config.dbhost + '/' + config.dbname;

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
//  res.write('sdfsdfsdfsssdfsdf\n');
  //res.end('date [' + appdate + ']  appserverip: ' + serverip+' appservername: '+hostname+'\n');
  var clientip = req.connection.remoteAddress;
  var ipaddr = require('ipaddr.js');
  if (ipaddr.IPv4.isValid(clientip)) {
    // ipString is IPv4
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
//  res.end('date [' + appdate + ']  appserverip: ' + serverip+' appservername: '+hostname+'\n');


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
          //process.exit(0)
      })
      client.end

  })

  res.end('appserverip: ' + serverip+' appservername: '+hostname+' clientip: '+clientip+'\n');

  console.log("Request received from " + clientip);

}).listen(port);






console.log('[' + appdate + ']  ' + serverip+' - '+hostname);

console.log('Server running at http://'+serverip+':'+port+'/');
