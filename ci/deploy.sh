#!/bin/bash

set -eo pipefail

cp -r build/var build/etc /
docker image load -i build/urfu-games-api.tar
docker image load -i build/urfu-games-files.tar
docker image load -i build/urfu-games-postgres.tar
