start-up:
	@make build
	@make up

build:
	docker-compose build

build-nc:
	docker-compose build --no-cache

up:
	docker-compose up -d

down:
	docker-compose down

node:
	docker-compose exec node ash

ps:
	docker-compose ps

yarn-install:
	@make yarn-install-for-container
	@make yarn-install-for-host

yarn-install-for-container:
	docker-compose exec node yarn install

yarn-install-for-host:
	docker-compose run --rm -v $$(pwd)/./src:/code -w /code node yarn install

npm-install:
	@make npm-install-for-container
	@make npm-install-for-host

npm-install-for-container:
	docker-compose exec node npm install

	# Makefileでは変数展開は実行前に行われてしまうので $$(pwd) のように $$ 2個付ける
	# :/code -w /code このcodeの部分dockerのマウントさせるディクレトリを指定している
npm-install-for-host:
	docker-compose run --rm -v $$(pwd)/./src:/code -w /code node npm install
