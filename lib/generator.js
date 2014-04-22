'use strict';

var fs = require('fs');
var path = require('path');

var _ = require('underscore');

function Generator(templateFile, targetFile) {
  templateFile = path.join(__dirname,
    '..',
    'templates',
    templateFile);
  var templateContent = fs.readFileSync(templateFile, {
    encoding: 'utf8'
  });

  this._template = _.template(templateContent);
  this._targetFile = targetFile;

  return this;
}

Generator.prototype.render = function (data, callback) {
  var output = this._template(data)
    .replace(/^\s*\n/gm, '\n');
  fs.writeFile(this._targetFile, output, callback);
};

module.exports = Generator;
