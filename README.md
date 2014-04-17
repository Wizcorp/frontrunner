# Frontrunner

Frontrunner is a daemon which triggers a reconfiguration of [HAProxy](http://haproxy.1wt.eu/),
when an application is modified on [Marathon](https://github.com/mesosphere/marathon).

It uses [node-zookeeper-client](https://github.com/alexguan/node-zookeeper-client)
to connect to the [ZooKeeper](http://zookeeper.apache.org/) cluster
used by [Marathon](https://github.com/mesosphere/marathon) and detect changes.

## Installation

    git clone https://github.com/Wizcorp/frontrunner.git

To install dependencies, run the following command in the created directory:

    npm install --production

If you don't plan to use yaml config files, you can use the following:

    npm install --production  --no-optional

## Configuration

Frontrunner use [node-config](https://github.com/lorenwest/node-config) to manage its configuration files.
You can write your configuration files in JavaScript, JSON or YAML.

A default [configuration file](config/default.json) is provided.
It shouldn't be edited.

It contains the following options:
* `zookeeperConnectionString`: Comma separated host:port pairs,
each represents a ZooKeeper server.
* `marathonUrl`: Marathon API url passed to the HAProxy config generator.
* `haproxyConfigGeneratorPath`: Path to the HAProxy config generator.
* `haproxyConfigFile`: Path to the HAProxy config file.
* `haproxyExecutable`: Path to the HAProxy executable.
* `haproxyPidFile`: Path to the HAProxy pid file.

To override some values, you have to create a new file with your environment name.

    # config/production.yml

    zookeeperConnectionString: "192.168.1.1:2181,192.168.1.2:2181,192.168.1.3:2181"
    marathonUrl: "http://192.168.1.1:8080"


## Usage

To run Frontrunner in the production environment and use the config file, you've just created, run the following:

    NODE_ENV=production npm start
