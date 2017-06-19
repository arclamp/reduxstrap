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

program.version(getVersionString())
  .description('Bootstrap a barebones Redux application into current directory')
  .option('-f --force', 'Create directory if it doesn\'t exist / overwrite contents if it does')
  .parse(process.argv);

var dest = process.cwd();

try {
  var options = {
    overwrite: !!program.force,
    errorOnExist: true
  };

  fs.copySync(path.resolve(__dirname, 'src'), path.resolve(dest, 'src'), options);
  fs.copySync(path.resolve(__dirname, 'webpack.config.js'), path.resolve(dest, 'webpack.config.js'), options);
} catch (e) {
  switch (e.code) {
    case 'ENOTDIR':
      console.error('error: ' + dest + ' is not a directory');
      break;

    case 'EACCES':
    case 'EPERM':
      console.error('error: insufficient permission');
      break;

    case undefined:
      console.error('error: ' + e.message);
      console.error('(use -f to force-copy)');
      break;

    default:
      console.error('error: unexpected condition', e.code);
      console.error(e.message);
  }

  process.exit(2);
}
