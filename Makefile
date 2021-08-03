SHELL := /bin/bash
GENERATED_DATA_DIR := .data

ifndef MKDOCS
	# MKDOCS := docker run --rm -it -v ${PWD}:/docs squidfunk/mkdocs-material
	MKDOCS := mkdocs
endif
ifndef PLANTUML
	PLANTUML := plantuml
endif
ifndef CURL
	CURL := curl
endif
ifndef JQ
	JQ := jq
endif
ifndef MKDIR
	MKDIR := mkdir
endif
ifndef PLANTUML_PARAMS
	PLANTUML_PARAMS := -tsvg
endif
MARKDOWN_FILES := $(shell find docs -name '*.md' -type f)

.PHONY: all
all: build

.PHONY: clean
clean:
	rm -rf site/
	rm -rf overrides/partials/github.json
	rm -rf docs/assets/stylesheets/vendor
	rm -rf docs/assets/javascripts/vendor

.PHONY: build
build: docs/assets/stylesheets/vendor/highlight.js/atom-one-dark.min.css docs/assets/javascripts/vendor/highlight.js/highlight.min.js github_stats
	$(MKDOCS) build

.PHONY: uml
uml: $(MARKDOWN_FILES)

.PHONY: $(MARKDOWN_FILES)
$(MARKDOWN_FILES):
	$(PLANTUML) $(PLANTUML_PARAMS) "$@" || echo "Markdown $@ has no diagrams"

.PHONY: github_stats
github_stats: overrides/partials/github.json

overrides/partials/github.json:
	mkdir -p ${GENERATED_DATA_DIR}
	$(CURL) -o ${GENERATED_DATA_DIR}/github-docs.json https://api.github.com/repos/HEPTACOM/heptaconnect-docs
	$(CURL) -o ${GENERATED_DATA_DIR}/github-dataset-base.json https://api.github.com/repos/HEPTACOM/heptaconnect-dataset-base
	$(CURL) -o ${GENERATED_DATA_DIR}/github-portal-base.json https://api.github.com/repos/HEPTACOM/heptaconnect-portal-base
	$(CURL) -o ${GENERATED_DATA_DIR}/github-storage-base.json https://api.github.com/repos/HEPTACOM/heptaconnect-storage-base
	$(CURL) -o ${GENERATED_DATA_DIR}/github-core.json https://api.github.com/repos/HEPTACOM/heptaconnect-core
	$(JQ) -s '{ stars: [ .[].stargazers_count ] | add, forks: [ .[].forks ] | add, repositories: . | length }' ${GENERATED_DATA_DIR}/github-*.json > overrides/partials/github.json

docs/assets/stylesheets/vendor/highlight.js/atom-one-dark.min.css:
	$(MKDIR) -p docs/assets/stylesheets/vendor/highlight.js
	$(CURL) -o docs/assets/stylesheets/vendor/highlight.js/atom-one-dark.min.css https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/atom-one-dark.min.css

docs/assets/javascripts/vendor/highlight.js/highlight.min.js:
	$(MKDIR) -p docs/assets/javascripts/vendor/highlight.js
	$(CURL) -o docs/assets/javascripts/vendor/highlight.js/highlight.min.js https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/highlight.min.js
