
BASE_IMAGE = node:13-alpine

help:
	@echo "usage: make [action]"
	@echo ""
	@echo "available actions:"
	@echo ""
	@echo "  test           run tests"
	@echo "  run            run app"
	@echo "  travis-setup   setup travis CI"
	@echo ""

define DOCKERFILE
FROM $(BASE_IMAGE)

RUN apk add --no-cache \
	make \
	git

WORKDIR /s

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
endef
export DOCKERFILE

test:
	echo "$$DOCKERFILE" | docker build . -f - -t temp
	docker run --rm -it temp sh -c \
	'cd /s && make test-nodocker'

test-nodocker:
	yarn test

run:
	echo "$$DOCKERFILE" | docker build . -f - -t temp
	docker run --rm -it -v $(PWD):/orig temp sh -c \
	'cd /s && make run-nodocker ARGS="$(ARGS)"'

run-nodocker:
	node cli.js $(ARGS)

define DOCKERFILE_TRAVIS
FROM ruby:alpine
RUN apk add --no-cache build-base git
RUN gem install travis
endef
export DOCKERFILE_TRAVIS

travis-setup:
	echo "$$DOCKERFILE_TRAVIS" | docker build - -t temp
	docker run --rm -it -v $(PWD):/s temp sh -c \
	"cd /s && travis setup npm --force"
