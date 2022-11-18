#!/bin/bash

set -xeo pipefail

cp -r var etc /
docker image load -i urfu-games-api.tar
docker image load -i urfu-games-files.tar
docker image load -i urfu-games-postgres.tar
