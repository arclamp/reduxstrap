#!/usr/bin/env node

var fs = require('fs-extra');
var path = require('path');

var program = require('commander');

function getVersionString () {
  var versionString = '<unknown>';

  try {
    var packageJson = fs.readFileSync(path.resolve(__dirname, 'package.json'));
    var data = JSON.parse(packageJson);

    versionString = data.version;
  } catch (e) {}

  return versionString;
}

var dest;
program.version(getVersionString())
  .description('Bootstrap a barebones Redux application into a directory')
  .usage('<target directory>')
  .option('-f --force', 'Create directory if it doesn\'t exist')
  .arguments('<directory>')
  .action(function (dir) {
    dest = dir;
  })
  .parse(process.argv);

if (dest === undefined) {
  program.help();
}

if (!program.force && !fs.existsSync(dest)) {
  console.error('Destination path does not exist; create it and try again, or use -f');
  process.exit(1);
}

try {
  fs.copySync(path.resolve(__dirname, 'src'), dest);
} catch (e) {
  switch (e.code) {
    case 'ENOTDIR':
      console.log('error: ' + dest + ' is not a directory');
      break;

    case 'EACCES':
    case 'EPERM':
      console.log('error: insufficient permission');
      break;

    default:
      console.error('error: unexpected condition');
      console.error(e.message);
  }

  process.exit(2);
}
