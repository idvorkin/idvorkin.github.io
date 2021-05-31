#!zsh
python3 build_back_links.py | prettier --parser=json > back-links.json
