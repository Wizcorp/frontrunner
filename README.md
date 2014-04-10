# Frontrunner

Frontrunner is a daemon which triggers a reconfiguration of [HAProxy](http://haproxy.1wt.eu/),
when an application is modified on [Marathon](https://github.com/mesosphere/marathon).

It uses [node-zookeeper-client](https://github.com/alexguan/node-zookeeper-client)
to connect to the [ZooKeeper](http://zookeeper.apache.org/) cluster
used by [Marathon](https://github.com/mesosphere/marathon) and detect changes.

## Installation

    git clone https://github.com/Wizcorp/frontrunner.git

## Configuration

The configuration file is a pure JavaScript file.
It is loaded with the `require()` function, so it has to be written as a module.

A default [configuration file](config.js) is provided.

It contains the following options:
* `zookeeperConnectionString`: Comma separated host:port pairs,
each represents a ZooKeeper server.
* `marathonUrl`: Marathon API url passed to the HAProxy config generator.
* `haproxyConfigGeneratorPath`: Path to the HAProxy config generator.
* `haproxyConfigFile`: Path to the HAProxy config file.
* `haproxyExecutable`: Path to the HAProxy executable.
* `haproxyPidFile`: Path to the HAProxy pid file.

## Usage

    npm start
