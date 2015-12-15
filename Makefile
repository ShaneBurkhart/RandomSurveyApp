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
	docker-compose run --rm web /bin/bash

mysql: migrate
	docker-compose run --rm mysql mysql --user=root --password=password --host=mysql --database=mydb

test: migrate
	docker-compose run --rm web npm test

migrate: start
	docker-compose run web npm run sequelize db:migrate

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
