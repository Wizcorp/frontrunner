'use strict';

var zookeeper = require('node-zookeeper-client');
var async = require('async');

var config = require('config');
var proxyConfig = config.proxy[config.activeProxy];

var Generator = require('./lib/generator');
var Marathon = require('./lib/marathon');
var proxy = require('./lib/proxy');

var generator = new Generator(proxyConfig.templatePath, proxyConfig.configFile);
var marathon = new Marathon(config.marathon.url);

var client = zookeeper.createClient(config.zookeeper.connectionString);
var zkRootPath = '/marathon/state';

var watchers = {};

var reloadTimeout = null;

function reloadConfig() {
  clearTimeout(reloadTimeout);
  reloadTimeout = null;

  async.waterfall([
    function (cb) {
      marathon.getTasks(function (err, tasks) {
        if (err && !reloadTimeout) {
          reloadTimeout = setTimeout(reloadConfig, config.marathon.retryDelay);
        }
        cb(err, tasks);
      });
    },
    function (tasks, cb) {
      generator.render({ tasks: tasks }, cb);
    },
    proxy.reload
  ], function (err) {
    if (err) {
      console.error(err);
    }
  });
}

function watchData(child) {
  /*
   * Skip if the watcher already exists
   * to avoid calling more than once the callback for the same event.
   */
  if (watchers[child]) {
    return;
  }

  var childPath = [zkRootPath, child].join('/');
  client.getData(childPath, function (event) {
    console.log('[%s] Got watcher event: %s', childPath, event);

    // Reload proxy config
    reloadConfig();

    // Delete the watcher, as the callback has been executed
    watchers[child] = null;

    // Create a new watcher if the node has not been deleted
    if (event && event.name !== 'NODE_DELETED') {
      watchData(child);
    }
  }, function (error) {
    if (error) {
      console.error(
        'Failed to get datas of %s due to: %s.',
        childPath,
        error
      );
      return;
    }

    // The watcher callback has been defined
    watchers[child] = true;
  });
}

function listChildren() {
  client.getChildren(
    zkRootPath,
    function (event) {
      console.log('[%s] Got watcher event: %s', zkRootPath, event);
      reloadConfig();
      listChildren();
    },
    function (error, children) {
      if (error) {
        console.error(
          'Failed to list children of %s due to: %s.',
          zkRootPath,
          error
        );
        return;
      }

      // List the running apps
      var apps = children
        .filter(function (child) {
          return child.indexOf('app') === 0;
        })
        .map(function (child) {
          return child.substr(child.indexOf(':') + 1);
        });

      // List the tasks for the running apps
      var tasks = children.filter(function (child) {
        if (child.indexOf('tasks') !== 0) {
          return false;
        }
        var appName = child.substr(child.indexOf(':') + 1);
        return (apps.indexOf(appName) !== -1);
      });
      tasks.forEach(watchData);
    }
  );
}

client.on('connected', function () {
  console.log('Connected to ZooKeeper.');
  listChildren();
  reloadConfig();
});

console.log('Trying to connect to ZooKeeper...');
client.connect();
