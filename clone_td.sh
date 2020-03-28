#  Expose techdiary in _td

# clea nand create fresh directories
rm -rf _td
mkdir _td
mkdir _td/notes
mkdir _td/images
cp   ~/gits/techdiary/README.md _td/index.md
cp  -R ~/gits/techdiary/notes _td
cp   -R ~/gits/techdiary/images _td
cd _td

# For each markdown file, prepend the corret header
fd  -e md  -exec sed -i '1s;^;---\nlayout: post\nno-render-title: true\n---\n\n_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/{})_\n\n;' {}
# Remove the trailing md
fd  -e md  -exec sed -i 's;](\(notes/.*\)\.md;](\1;' {}
# Really Hacky (Ha), index is copied from readme, so put that back.
sed -i 's;blob/master/index.md;;' index.md

#TODO: Re-write



