.PHONY: build

TIMESHEETSUI_VERSION := latest

build: # @HELP build the Web GUI and run all validations (default)
build: deps
	ng build --prod

test: # @HELP run the unit tests and source code validation
test: deps build lint license_check
	ng test --browsers=ChromeHeadless,FirefoxHeadless --watch=false

deps: # @HELP ensure that the required dependencies are in place
	NG_CLI_ANALYTICS=false npm install

lint: # @HELP run the linters for Typescript source code
	ng lint

license_check: # @HELP examine and ensure license headers exist
	@if [ ! -d "../build-tools" ]; then cd .. && git clone https://github.com/onosproject/build-tools.git; fi
	./../build-tools/licensing/boilerplate.py -v --rootdir=${CURDIR}

timesheetsui-docker: # @HELP build timesheetsui Docker image
	docker build . -f build/timesheetsui/Dockerfile \
		-t onosproject/timesheetsui:${TIMESHEETSUI_VERSION}

images: # @HELP build all Docker images
images: build timesheetsui-docker

kind: # @HELP build Docker images and add them to the currently configured kind cluster
kind: images
	@if [ `kind get clusters` = '' ]; then echo "no kind cluster found" && exit 1; fi
	kind load docker-image onosproject/timesheetsui:${TIMESHEETSUI_VERSION}

all: build images

publish: # @HELP publish version on github and dockerhub
	./../build-tools/publish-version ${VERSION}

clean: # @HELP remove all the build artifacts
	rm -rf ./web/timesheetsui/dist ./web/timesheetsui/node_modules

help:
	@grep -E '^.*: *# *@HELP' $(MAKEFILE_LIST) \
    | sort \
    | awk ' \
        BEGIN {FS = ": *# *@HELP"}; \
        {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}; \
    '
