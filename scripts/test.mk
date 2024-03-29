define DOCKERFILE_TEST
FROM $(BASE_IMAGE)

RUN apk add --no-cache \
	make \
	git

WORKDIR /s

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
endef
export DOCKERFILE_TEST

test:
	echo "$$DOCKERFILE" | docker build . -f - -t temp
	docker run --rm -it temp sh -c \
	'make test-nodocker'

test-nodocker:
	yarn test
