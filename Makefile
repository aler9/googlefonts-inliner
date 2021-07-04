
BASE_IMAGE = node:14-alpine3.13

help:
	@echo "usage: make [action]"
	@echo ""
	@echo "available actions:"
	@echo ""
	@echo "  test           run tests"
	@echo "  run            run app"
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
	'make test-nodocker'

test-nodocker:
	yarn test

run:
	echo "$$DOCKERFILE" | docker build . -f - -t temp
	docker run --rm -it -v $(PWD):/orig temp sh -c \
	'make run-nodocker ARGS="$(ARGS)"'

run-nodocker:
	node cli.js $(ARGS)
