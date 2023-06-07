#!/bin/bash

# Cборка production версии проекта.

set -eo pipefail

if [[ $1 == "-v" ]]; then # verbose mode
    set -x
fi

CI_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$CI_DIR/.."
BUILD_DIR="$CI_DIR/build"
API_IMAGE_NAME="urfu-games-api"
FILES_IMAGE_NAME="urfu-games-files"
POSTGRES_IMAGE_NAME="urfu-games-postgres"
API_URI="https://api.89.223.124.186.com"
FILES_URI="https://files.89.223.124.186.com"
YM_ID=0

rm -rf $BUILD_DIR/*
mkdir -p $BUILD_DIR

echo "Building backend..."
cd $PROJECT_DIR/api
docker image build -t $API_IMAGE_NAME:prod --target prod .
docker image save $API_IMAGE_NAME -o "$BUILD_DIR/$API_IMAGE_NAME.tar"
echo "Done."

echo "Building files service..."
cd $PROJECT_DIR/files
docker image build -t $FILES_IMAGE_NAME:prod --target prod .
docker image save $FILES_IMAGE_NAME -o "$BUILD_DIR/$FILES_IMAGE_NAME.tar"
mkdir -p $BUILD_DIR/var/www/files.89.223.124.186.com
echo "Done."

echo "Building frontend..."
mkdir -p $BUILD_DIR/var/www/89.223.124.186.com
cd $PROJECT_DIR/frontend
yarn install
API_URI=$API_URI FILES_URI=$FILES_URI yarn build
cp -r $PROJECT_DIR/frontend/build/* $BUILD_DIR/var/www/89.223.124.186.com/
echo "Done."

echo "Building Postgres database..."
cd $PROJECT_DIR/postgres
docker image build -t $POSTGRES_IMAGE_NAME .
docker image save $POSTGRES_IMAGE_NAME -o "$BUILD_DIR/$POSTGRES_IMAGE_NAME.tar"
echo "Done."

echo "Building Nginx server configuration..."
mkdir -p $BUILD_DIR/etc/nginx
cp -r $PROJECT_DIR/nginx/nginx.conf $BUILD_DIR/etc/nginx/
echo "Done."

