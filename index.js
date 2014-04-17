'use strict';

var exec = require('child_process').exec;
var zookeeper = require('node-zookeeper-client');
var config = require('config');

var client = zookeeper.createClient(config.zookeeperConnectionString);
var zkRootPath = '/marathon/state';

var watchers = {};

function reloadConfig() {
  /*
   * Create a command which will launch the haproxyConfigGeneratorPath,
   * write the output in the specified haproxyConfigFile,
   * and reload HAProxy.
   */
  var cmd = [
    config.haproxyConfigGeneratorPath,
    config.marathonUrl,
    '>',
    config.haproxyConfigFile,
    '&&',
    config.haproxyExecutable,
    '-f',
    config.haproxyConfigFile,
    '-p',
    config.haproxyPidFile,
    '-sf',
    '$(cat',
    config.haproxyPidFile,
    ')'
  ].join(' ');

  exec(cmd, function (error) {
    if (error !== null) {
      console.error('exec error: ' + error);
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

    // Reload HAProxy config
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
          return child.search('app') === 0;
        })
        .map(function (child) {
          return child.substr(child.indexOf(':') + 1);
        });

      // List the tasks for the running apps
      var tasks = children.filter(function (child) {
        if (child.search('tasks') !== 0) {
          return false;
        }
        var appName = child.substr(child.indexOf(':') + 1);
        return (apps.indexOf(appName) !== -1);
      });
      tasks.forEach(watchData);
    }
  );
}

client.once('connected', function () {
  console.log('Connected to ZooKeeper.');
  listChildren();
  reloadConfig();
});

client.connect();
