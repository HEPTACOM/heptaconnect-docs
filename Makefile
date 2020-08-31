SHELL := /bin/bash
ifndef NPM
	NPM := npm
endif

.PHONY: all
all: build

.PHONY: build
build:
	$(NPM) run prod
