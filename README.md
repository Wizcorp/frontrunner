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
* `zookeeper.connectionString`: Comma separated host:port pairs,
each represents a ZooKeeper server.
* `marathon.url`: Marathon API url passed to the HAProxy config generator.
* `activeProxy`: The name of the proxy to use.
* `proxy`: Configuration objects for the supported proxies.
    Each object is as follows:
    * `configGeneratorPath`: Path to the proxy config generator.
    * `configFile`: Path to the proxy config file.
    * `reloadCommand`: Command to run to reload the proxy.

To override some values, you have to create a new file with your environment name.

    # config/production.yml

    zookeeper:
      connectionString: "192.168.1.1:2181,192.168.1.2:2181,192.168.1.3:2181"
    marathon:
      url: "http://192.168.1.1:8080"
    proxy:
      haproxy:
        configGeneratorPath: "/opt/frontrunner/haproxy_cfg"
        reloadCommand: "service haproxy reload"


## Usage

To run Frontrunner in the production environment and use the config file, you've just created, run the following:

    NODE_ENV=production npm start
