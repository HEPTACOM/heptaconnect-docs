SHELL := /bin/bash

ifndef MKDOCS
	# MKDOCS := docker run --rm -it -v ${PWD}:/docs squidfunk/mkdocs-material
	MKDOCS := mkdocs
endif
ifndef PLANTUML
	PLANTUML := plantuml
endif
ifndef PLANTUML_PARAMS
	PLANTUML_PARAMS := -tsvg
endif
MARKDOWN_FILES := $(shell find docs -name '*.md' -type f)

.PHONY: all
all: build

.PHONY: build
build:
	$(MKDOCS) build

.PHONY: uml
uml: $(MARKDOWN_FILES)

.PHONY: $(MARKDOWN_FILES)
$(MARKDOWN_FILES):
	$(PLANTUML) $(PLANTUML_PARAMS) "$@" || echo "Markdown $@ has no diagrams"
