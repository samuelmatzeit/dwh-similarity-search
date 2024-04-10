#!/bin/bash

docker compose down -v
sudo rm -rf data/
docker compose build --no-cache
docker compose up -d
