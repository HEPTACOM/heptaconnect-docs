SHELL := /bin/bash

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
ifndef MKDIR
	MKDIR := mkdir
endif
ifndef PLANTUML_PARAMS
	PLANTUML_PARAMS := -tsvg
endif
MARKDOWN_FILES := $(shell find docs -name '*.md' -type f)

.PHONY: all
all: build

.PHONY: build
build: docs/assets/stylesheets/vendor/highlight.js/atom-one-dark.min.css docs/assets/javascripts/vendor/highlight.js/highlight.min.js
	$(MKDOCS) build

.PHONY: uml
uml: $(MARKDOWN_FILES)

.PHONY: $(MARKDOWN_FILES)
$(MARKDOWN_FILES):
	$(PLANTUML) $(PLANTUML_PARAMS) "$@" || echo "Markdown $@ has no diagrams"

docs/assets/stylesheets/vendor/highlight.js/atom-one-dark.min.css:
	$(MKDIR) -p docs/assets/stylesheets/vendor/highlight.js
	$(CURL) -o docs/assets/stylesheets/vendor/highlight.js/atom-one-dark.min.css https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/atom-one-dark.min.css

docs/assets/javascripts/vendor/highlight.js/highlight.min.js:
	$(MKDIR) -p docs/assets/javascripts/vendor/highlight.js
	$(CURL) -o docs/assets/javascripts/vendor/highlight.js/highlight.min.js https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/highlight.min.js
