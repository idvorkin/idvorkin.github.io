default:
    @just --list

coverage-instrument:
    npx nyc instrument --compact=false _site/assets/js instrumented

coverage-report:
    npx nyc report --reporter html --reporter text && open coverage/index.html

cy-ut:
    npx cypress run --config video=false --spec '**/unit/*ts'

cy-run:
    npx cypress run --config video=false --env coverage=false

cy-prod-run:
    npx cypress run --config video=false --env coverage=false --config baseUrl=https://idvork.in

cy-record:
    . ./_cypress_api_key && npx cypress run --record --env coverage=false

cy-open:
    npx cypress open --env coverage=false

jekyll-serve:
    #!/usr/bin/env sh
    if [ "$(uname)" = "Darwin" ]; then
        just internal-jekyll-mac-serve
    else
        bundle exec jekyll server --incremental --livereload --host 127.0.0.1
    fi

internal-jekyll-mac-serve:
    ~/homebrew/opt/ruby/bin/bundle exec jekyll server --incremental --livereload --host 127.0.0.1

jekyll-container:
    bundle exec jekyll server --incremental --livereload --host 0.0.0.0

docker-build:
    docker build -t devdocker devdocker

parcel-start:
    parcel src/index.html

parcel-build:
    parcel build src/index.ts

parcel-watch:
    rm -rf .parcel-cache dist && parcel watch src/index.ts

parcel-clean:
    rm -rf .parcel-cache dist

docker-run2:
    docker run -v ~/blog:/root/blog -p 35729:35729 -p 4000:4000 -it devdocker

docker-run:
    docker run -v ~/blog:/root/blog -it -p 35729:35729 -p 4000:4000 devdocker npm run jekyll:container

update-backlinks:
    /usr/bin/env uv run build_back_links.py build > back-links.json

update-search:
    bundle exec jekyll algolia

update-ig66:
    python3 old_blog/transform_blogger_export.py export-all > _ig66/ig66-export.json

update-eulogy:
    python3 scripts/eulogy_to_json.py > eulogy.json

update-fj:
    python3 old_blog/transform_blogger_export.py export-all > _ig66/ig66-export.json

back-links:
    just update-backlinks

tsc:
    tsc --watch --allowUmdGlobalAccess

broken-links:
    scrapy runspider linkchecker.py -O ~/tmp/brokenlinks.csv && cat ~/tmp/brokenlinks.csv

prepare:
    husky install
