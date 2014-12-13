FROM google/nodejs

MAINTAINER Emilien Kenler <ekenler@wizcorp.jp>

RUN echo "deb http://cdn.debian.net/debian wheezy-backports main" > /etc/apt/sources.list.d/backports.list
RUN apt-get update -y && apt-get install -y haproxy -t wheezy-backports

ADD . /opt/frontrunner
WORKDIR /opt/frontrunner
RUN npm install --production

ENV NODE_ENV production

EXPOSE 80

ENTRYPOINT ["node", "index.js"]

