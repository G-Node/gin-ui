#!/bin/bash

# run this script as normal user w/o sudo from within the gin-ui root folder.
set -e

CNOC="\033[0m"
CAOK="\033[32;01m"
CERR="\033[31;01m"
CWRN="\033[33;01m"

GOPATH=/opt/deploy/go

echo -e "Running in ${CAOK}$PWD $CNOC"
REPO=$(basename $PWD)
if [ "$REPO" != "gin-ui" ]; then
    echo -e "${CERR}* Not in gin-ui *${CNOC}"
    exit 1
fi

echo "Pulling latest changes"
BRANCH=$(sudo -u deploy git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" != "master" ]; then
    echo -e "${CERR}* Not on branch master${CNOC} [${CWRN}$BRANCH${CNOC}]"
    exit 1
fi

sudo -u deploy git pull origin master

echo "Setting up config file"
sudo -u deploy cp /opt/deploy/service_conf/gin-ui/config.json /opt/deploy/gin-ui/src/js/

echo "Installing gin-ui"
sudo -u deploy npm install
sudo -u deploy npm run build

echo "Reset config file"
sudo -u deploy git checkout src/js/config.json

echo -e "${CAOK}Done${CNOC}."
