FROM node:alpine

RUN mkdir -p /gin-ui
WORKDIR /gin-ui

ADD ./ /gin-ui/

# The configuration file lies here (config.json)
VOLUME /gin-ui/src/js/
# The folder where the final app will end up in
VOLUME /gin-ui/build

RUN npm install
ENTRYPOINT npm run build