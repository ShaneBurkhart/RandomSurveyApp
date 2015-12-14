all: start

BASE_TAG=shaneburkhart/random-survey-app

build:
	docker build -t ${BASE_TAG} .

start:
	docker-compose up -d

restart: clean start

stop:
	docker stop $$(docker ps -aq)

clean: stop
	docker rm $$(docker ps -aq)

ps:
	docker-compose ps

logs:
	docker-compose logs

c:
	docker-compose run web /bin/bash
