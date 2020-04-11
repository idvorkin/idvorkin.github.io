#  Expose techdiary in _td

# clea nand create fresh directories
rm -rf _td
mkdir _td
mkdir _td/images
cp   ~/gits/techdiary/* _td
mv   _td/README.md _td/index.md
cp   -R ~/gits/techdiary/images _td
cd _td

# The only .md links should be for the techdiary, and need to strip those so
# it also works from idvork.in (Needs to run before appending header
fd  -e md  -exec sed -i 's;\.md););' {}

# For each markdown file, prepend the corret header
fd  -e md  -exec sed -i '1s;^;---\nlayout: post\nno-render-title: true\nREPLACETITLE\n---\n\n_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/{})_\n\n;' {}
# Remove the trailing md
#fd  -e md  -exec sed -i 's;](\(notes/.*\)\.md;](\1;' {}


# Really Hacky (Ha), index is copied from readme, so put that back.
sed -i 's;blob/master/index.md;;' index.md

# Should move all processing to python file
fd  -e md  -exec python3 ../raw_github_to_blog.py {}

#TODO: Re-write



