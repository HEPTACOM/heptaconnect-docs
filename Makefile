SHELL := /bin/bash
ifndef NPM
	NPM := npm
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
build: node_modules
	$(NPM) run prod

node_modules:
	$(NPM) ci

.PHONY: uml
uml: $(MARKDOWN_FILES)

.PHONY: $(MARKDOWN_FILES)
$(MARKDOWN_FILES):
	$(PLANTUML) $(PLANTUML_PARAMS) "$@" || echo "Markdown $@ has no diagrams"
