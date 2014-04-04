module.exports = {
  zookeeperConnectionString: 'localhost:2181',
  marathonUrl: 'http://localhost:8080',
  haproxyConfigGeneratorPath: '/opt/marathon/bin/haproxy_cfg',
  haproxyConfigFile: '/etc/haproxy/haproxy.cfg',
  haproxyExecutable: 'haproxy',
  haproxyPidFile: '/var/run/haproxy.pid'
};
