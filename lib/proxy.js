'use strict';

var exec = require('child_process').exec;

var config = require('config');
var proxyConfig = config.proxy[config.activeProxy];

var lastReload = null;
var reloadTimeout = null;

module.exports.reload = function reload(cb) {

  var currentDate = Date.now();

  // Something is already scheduled in the future
  if (reloadTimeout &&
    (reloadTimeout._idleStart + reloadTimeout._idleTimeout) > currentDate) {
    return cb();
  }

  // Check if a reload has been done recently
  if (lastReload && proxyConfig.reloadDelay &&
    (currentDate - lastReload) < proxyConfig.reloadDelay) {
    // Schedule the reload later
    reloadTimeout = setTimeout(reload, proxyConfig.reloadDelay, function (err) {
      if (err) {
        console.error(err);
      }
    });
    return cb(new Error('Proxy already reloaded in the last ' +
      proxyConfig.reloadDelay + 'ms. Schedule it later.'));
  }

  // Do the reload now
  exec(proxyConfig.reloadCommand, function (err) {
    lastReload = currentDate;
    return cb(err);
  });
};
