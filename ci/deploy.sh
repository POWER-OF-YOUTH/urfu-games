#!/bin/bash

# Запуск production версии проекта.

set -eo pipefail

CI_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$CI_DIR/build"

cp -r $BUILD_DIR/var $BUILD_DIR/etc /
docker image load -i $BUILD_DIR/urfu-games-api.tar
docker image load -i $BUILD_DIR/urfu-games-files.tar
docker image load -i $BUILD_DIR/urfu-games-postgres.tar
