var path = require('path');
var spawn = require('cross-spawn'); // spawn child process
var httpServer = require('http-server');  // simple server
var server = httpServer.createServer({
  root: path.resolve(__dirname, '../../') // root directory
});

server.listen(8080); // 8080 port

var args = process.argv.slice(2); // split arguments
if (args.indexOf('--config') === -1) { // lack of config
  args = args.concat(['--config', 'build/nightwatch.config.js']); // default config
}
if (args.indexOf('--env') === -1) { // prevent lack of config
  args = args.concat(['--env', 'chrome,phantomjs']); // default browser launcher
}
var i = args.indexOf('--test');
if (i > -1) {
  args[i + 1] = 'test/e2e/specs/' + args[i + 1] + '.js' // specfic test folder
}

var runner = spawn('./node_modules/.bin/nightwatch', args, {
  stdio: 'inherit'
});

runner.on('exit', function (code) { // exit logic
  server.close();
  process.exit(code)
});

runner.on('error', function (err) { // error logic
  server.close();
  throw err
});
