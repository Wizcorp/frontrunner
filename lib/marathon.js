'use strict';

var request = require('request');

function removeEmptyItemFilter(item) {
  return item.length > 0;
}

function tasksFromTextToObject(text) {
  return text
    .replace(/([ \t]+)/gm, ' ')     // Remove duplicate spaces
    .split('\n')                    // Create an array with the tasks
    .filter(removeEmptyItemFilter)  // Remove empty element
    .map(function (line) {          // Each task must be an object
      var fields = line.split(' ');
      return {
        name: fields[0],            // The first element is the name of the app
        port: parseInt(fields[1], 10),  // The second element is the port to use
        endpoints: fields.slice(2)  // The following elements are the endpoints
          .filter(removeEmptyItemFilter)
      };
    });
}

function Marathon(marathonUrl) {
  this._marathonUrl = marathonUrl;

  return this;
}

Marathon.prototype.getTasks = function (callback) {
  function onResponse(error, response, body) {
    if (error) {
      return callback(new Error('Unable to get the tasks using the Marathon ' +
        'API. ' + error.toString()));
    }
    var tasks = tasksFromTextToObject(body);
    return callback(null, tasks);
  }

  var options = {
    url: this._marathonUrl + '/v2/tasks',
    headers: {
      'Accept': 'text/plain'
    }
  };
  request.get(options, onResponse);
};

module.exports = Marathon;
