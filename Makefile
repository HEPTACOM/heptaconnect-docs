SHELL := /bin/bash
GENERATED_DATA_DIR := .data
REPOS = heptaconnect-bridge-shopware-platform \
		heptaconnect-core \
		heptaconnect-dataset-base \
		heptaconnect-dataset-ecommerce \
		heptaconnect-framework \
		heptaconnect-portal-base \
		heptaconnect-portal-local-shopware-platform \
		heptaconnect-storage-base \
		heptaconnect-storage-shopware-dal \
		heptaconnect-test-suite-storage

ifndef MKDOCS
	# MKDOCS := docker run --rm -it -v ${PWD}:/docs squidfunk/mkdocs-material
	MKDOCS := mkdocs
endif
ifndef CURL
	CURL := curl
endif
ifndef PHP
	PHP := $(shell which php) $(PHP_EXTRA_ARGS)
endif
ifndef COMPOSER
	COMPOSER := $(PHP) $(shell which composer)
endif
ifndef JQ
	JQ := jq
endif
ifndef MKDIR
	MKDIR := mkdir
endif
ifndef MV
	MV := mv
endif
ifndef RM
	RM := rm
endif
ifndef NPM
	NPM := npm
endif
ifndef GIT
	GIT := git
endif

.PHONY: all
all: build

.PHONY: clean
clean:
	rm -rf ${GENERATED_DATA_DIR}/
	rm -rf site/
	rm -rf overrides/partials/github.json
	rm -rf docs/assets/stylesheets/vendor
	rm -rf docs/assets/javascripts/vendor

.PHONY: build
build: assets/css/vendor/highlight.js/atom-one-dark.min.css docs/assets/javascripts/vendor/highlight.js/highlight.min.js github_stats rss adr node_modules git-code-dependencies
	$(NPM) run mkdocs-pdf
	$(MKDOCS) build -f mkdocs-pdf.yml
	$(MV) site/pdf/document.pdf document.pdf
	$(NPM) run prod
	$(MKDOCS) build
	$(NPM) run html-minify
	$(NPM) run cache-breaker
	$(MV) document.pdf site/HEPTAconnect.pdf

.PHONY: github_stats
github_stats: overrides/partials/github.json

.PHONY: rss
rss: node_modules
	$(NPM) run rss

.PHONY: adr
adr: node_modules
	$(NPM) run adr

overrides/partials/github.json: $(GENERATED_DATA_DIR)
	$(CURL) -o ${GENERATED_DATA_DIR}/github-framework.json https://api.github.com/repos/HEPTACOM/heptaconnect-framework
	$(CURL) -o ${GENERATED_DATA_DIR}/github-bridge-shopware-platform.json https://api.github.com/repos/HEPTACOM/heptaconnect-bridge-shopware-platform
	$(CURL) -o ${GENERATED_DATA_DIR}/github-core.json https://api.github.com/repos/HEPTACOM/heptaconnect-core
	$(CURL) -o ${GENERATED_DATA_DIR}/github-dataset-base.json https://api.github.com/repos/HEPTACOM/heptaconnect-dataset-base
	$(CURL) -o ${GENERATED_DATA_DIR}/github-dataset-ecommerce.json https://api.github.com/repos/HEPTACOM/heptaconnect-dataset-ecommerce
	$(CURL) -o ${GENERATED_DATA_DIR}/github-docs.json https://api.github.com/repos/HEPTACOM/heptaconnect-docs
	$(CURL) -o ${GENERATED_DATA_DIR}/github-playground.json https://api.github.com/repos/HEPTACOM/heptaconnect-playground
	$(CURL) -o ${GENERATED_DATA_DIR}/github-portal-base.json https://api.github.com/repos/HEPTACOM/heptaconnect-portal-base
	$(CURL) -o ${GENERATED_DATA_DIR}/github-portal-local-shopware-platform.json https://api.github.com/repos/HEPTACOM/heptaconnect-portal-local-shopware-platform
	$(CURL) -o ${GENERATED_DATA_DIR}/github-storage-base.json https://api.github.com/repos/HEPTACOM/heptaconnect-storage-base
	$(CURL) -o ${GENERATED_DATA_DIR}/github-storage-shopware-dal.json https://api.github.com/repos/HEPTACOM/heptaconnect-storage-shopware-dal
	$(CURL) -o ${GENERATED_DATA_DIR}/github-test-suite-storage.json https://api.github.com/repos/HEPTACOM/heptaconnect-test-suite-storage
	$(JQ) -s '{ stars: [ .[].stargazers_count ] | add, forks: [ .[].forks ] | add, repositories: . | length }' ${GENERATED_DATA_DIR}/github-*.json > overrides/partials/github.json

assets/css/vendor/highlight.js/atom-one-dark.min.css:
	$(MKDIR) -p assets/css/vendor/highlight.js
	$(CURL) -o assets/css/vendor/highlight.js/atom-one-dark.min.css https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/atom-one-dark.min.css

docs/assets/javascripts/vendor/highlight.js/highlight.min.js:
	$(MKDIR) -p docs/assets/javascripts/vendor/highlight.js
	$(CURL) -o docs/assets/javascripts/vendor/highlight.js/highlight.min.js https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/highlight.min.js

.PHONY: git-code-dependencies
git-code-dependencies: $(REPOS)

.PHONY: $(REPOS)
$(REPOS): $(GENERATED_DATA_DIR)
	$(GIT) -C "${GENERATED_DATA_DIR}/git-$@" pull --ff-only || git clone "https://github.com/HEPTACOM/$@.git" "${GENERATED_DATA_DIR}/git-$@"
	stat ${GENERATED_DATA_DIR}/git-heptaconnect-src || mkdir ${GENERATED_DATA_DIR}/git-heptaconnect-src
	test -d "${GENERATED_DATA_DIR}/git-$@/src" && cp -a "${GENERATED_DATA_DIR}/git-$@/src" "${GENERATED_DATA_DIR}/git-heptaconnect-src/$@" || cp -a "${GENERATED_DATA_DIR}/git-$@" "${GENERATED_DATA_DIR}/git-heptaconnect-src/$@"

.bin/PhpDependencyAnalysis:
	$(GIT) clone https://github.com/HEPTACOM/PhpDependencyAnalysis.git .bin/PhpDependencyAnalysis
	$(COMPOSER) install -d .bin/PhpDependencyAnalysis

node_modules:
	$(NPM) ci --include=dev

$(GENERATED_DATA_DIR):
	mkdir -p ${GENERATED_DATA_DIR}
