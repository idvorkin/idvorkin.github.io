# Makefile — tiny, additive. Does NOT replace justfile or Jekyll build.
#
# Current targets:
#   make epub   — build dist/idvork-collected.epub from _d/ and _posts/
#   make clean  — remove the EPUB build output

.PHONY: epub clean
epub:
	./scripts/build-epub.sh

clean:
	rm -rf dist/epub-build dist/idvork-collected.epub dist/epub-build-failures.txt
