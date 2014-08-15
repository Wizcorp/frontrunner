# Changelog

## v0.1.2

* Better error message if the request to the Marathon API fails. (#12)
* Reload the config after a zookeeper reconnection. (#12)

## v0.1.1

* Wait a specified amount of time between two reload. (#11)

## v0.1.0

* Watch Marathon application nodes in ZooKeeper.
* Generate a configuration file from a template via underscore.
* Reload the proxy after generating the configuration file.
* Use [node-config](https://github.com/lorenwest/node-config) to manage
  Frontrunner configuration.
* Allow using YAML to write Frontrunner configuration file.

