@echo off

REM Az alapértelmezett Docker Compose parancsok futtatása
echo Docker Compose build and up process is starting...

REM Minden szükséges Docker Compose parancsot végrehajtunk
docker-compose down --volumes --remove-orphans
docker-compose up --build -d

echo Docker Compose is up and running!
