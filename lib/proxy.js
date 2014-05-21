'use strict';

var exec = require('child_process').exec;

var config = require('config');
var proxyConfig = config.proxy[config.activeProxy];

var lastReload = null;
var reloadTimeout = null;

module.exports.reload = function reload(cb) {

  // Remove previously scheduled reload
  if (reloadTimeout) {
    clearTimeout(reloadTimeout);
  }

  var currentDate = Date.now();
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
  lastReload = currentDate;

  // Do the reload now
  exec(proxyConfig.reloadCommand, cb);
};
