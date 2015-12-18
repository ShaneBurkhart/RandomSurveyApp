all: start

BASE_TAG=shaneburkhart/random-survey-app
NGINX_BASE_TAG=shaneburkhart/random-survey-app-nginx

DOCKER_COMPOSE_FILE?=docker-compose.yml
TEST_DOCKER_COMPOSE_FILE?=docker-compose.test.yml

build:
	docker build -t ${BASE_TAG} .
	docker run -v $(shell pwd)/public:/app/public ${BASE_TAG} npm run gulp
	docker build -f Dockerfile.nginx -t ${NGINX_BASE_TAG} .

start:
	docker-compose -f ${DOCKER_COMPOSE_FILE} up -d
	echo "Wait for db to start."
	sleep 10
	docker-compose -f ${DOCKER_COMPOSE_FILE} run web npm run sequelize db:migrate
	docker-compose -f ${DOCKER_COMPOSE_FILE} run web npm run sequelize db:seed

restart: clean start

stop:
	docker stop $$(docker ps -q)

clean: stop
	docker rm $$(docker ps -aq)

ps:
	docker-compose ps

logs:
	docker-compose logs

c:
	docker-compose run --rm web /bin/bash

mysql: start
	docker-compose run --rm mysql mysql --user=root --password=password --host=mysql --database=mydb

test:
	docker-compose -f ${TEST_DOCKER_COMPOSE_FILE} -p survey-test up -d
	echo "Wait for db to start."
	sleep 6
	docker-compose -f ${TEST_DOCKER_COMPOSE_FILE} -p survey-test run web npm run sequelize db:migrate
	docker-compose -f ${TEST_DOCKER_COMPOSE_FILE} -p survey-test run --rm web npm test

migration:
ifdef NAME
	npm run sequelize -- migration:create --name="${NAME}"
else
	echo "No NAME variable given for the migration."
endif

model:
ifdef NAME
	npm run sequelize -- model:create --name="${NAME}" --attributes="${ATTRS}"
else
	echo "No NAME variable given for the model."
endif
