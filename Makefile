
BASE_IMAGE = node:14-alpine3.14

help:
	@echo "usage: make [action]"
	@echo ""
	@echo "available actions:"
	@echo ""
	@echo "  test      run tests"
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
