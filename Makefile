SHELL := /bin/bash
ifndef NPM
	NPM := npm
endif

.PHONY: all
all: build

.PHONY: build
build: node_modules
	$(NPM) run prod

node_modules:
	$(NPM) ci
