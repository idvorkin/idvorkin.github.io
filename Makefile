# Makefile — tiny, additive. Does NOT replace justfile or Jekyll build.
#
# Current targets:
#   make epub   — build dist/idvork-collected.epub from _d/ and _posts/

.PHONY: epub
epub:
	./scripts/build-epub.sh
