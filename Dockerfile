FROM httpd

ENV NODE_VERSION=6.10.1

RUN /bin/bash

RUN apt-get update
RUN apt-get install -y --no-install-recommends ca-certificates   curl   wget
RUN rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y --no-install-recommends bzr   git   mercurial   openssh-client   subversion \
    procps  && rm -rf /var/lib/apt/lists/*

RUN set -ex; apt-get update;  apt-get install -y --no-install-recommends  autoconf   automake   bzip2   file   g++   gcc \
    imagemagick   libbz2-dev   libc6-dev   libcurl4-openssl-dev   libdb-dev   libevent-dev   libffi-dev   libgdbm-dev \
    libgeoip-dev   libglib2.0-dev   libjpeg-dev   libkrb5-dev   liblzma-dev   libmagickcore-dev   libmagickwand-dev \
    libncurses-dev   libpng-dev   libpq-dev   libreadline-dev   libsqlite3-dev   libssl-dev   libtool   libwebp-dev \
    libxml2-dev   libxslt-dev   libyaml-dev   make   patch   xz-utils   zlib1g-dev \
    $(    if apt-cache show 'default-libmysqlclient-dev' 2>/dev/null | grep -q '^Version:'; then     echo 'default-libmysqlclient-dev';    else     echo 'libmysqlclient-dev';    fi   )  ;\
    rm -rf /var/lib/apt/lists/*


RUN groupadd --gid 1000 node && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

RUN set -ex && for key in 9554F04D7259F04124DE6B476D5A82AC7E37093B     94AE36675C464D64BAFA68DD7434390BDBE9B9C5     FD3A5288F042B6850C66B31F09FE44734EB7990E     71DCFD284A79C3B38668286BC97EC7A07EDE3FC1     DD8F2338BAE7501E3DD5AC78C273792F7D83545D     B9AE9905FFD7803F25714661B63B535A4C206CA9     C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8     56730D5401028683275BD23C23EFEFE93C4CFFFE   ; do     gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key";   done


RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
    && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc"
RUN gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc   \
    && grep " node-v$NODE_VERSION-linux-x64.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
    && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
    && rm "node-v$NODE_VERSION-linux-x64.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
    && ln -s /usr/local/bin/node /usr/local /bin/nodejs

#RUN mkdir -p /gin-ui
#WORKDIR /gin-ui

#ADD ./ /gin-ui/

# The configuration file lies here (config.json)
#VOLUME /gin-ui/src/js/
# The folder where the final app will end up in
#VOLUME /gin-ui/build

#RUN npm install
#ENTRYPOINT npm run build