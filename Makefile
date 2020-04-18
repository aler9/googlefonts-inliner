
BASE_IMAGE = node:12-alpine

define DOCKERFILE
FROM $(BASE_IMAGE)

RUN apk add --no-cache \
	make

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
	npm test

run:
	echo "$$DOCKERFILE" | docker build . -f - -t temp
	docker run --rm -it -v $(PWD):/orig temp sh -c \
	'cd /s && make run-nodocker ARGS="$(ARGS)"'

run-nodocker:
	node cli.js $(ARGS)
