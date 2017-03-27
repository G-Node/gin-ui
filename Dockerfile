FROM node

RUN /bin/bash

RUN apt-get update
RUN apt-get install -y --no-install-recommends apache2


RUN mkdir -p /gin-ui
COPY ./ /gin-ui
WORKDIR /gin-ui
# The configuration file lies here (config.json)
VOLUME /gin-ui/src/js/
# The folder where the final app will end up in
VOLUME /gin-ui/build

RUN npm install

EXPOSE 80

ENTRYPOINT npm run build && cp -r /gin-ui/build/* /var/www/html/ && /etc/init.d/apache2 start&&/bin/bash
