# input file
# write file in place
import sys
import os
import re

print("This file is now junk")


if len(sys.argv) != 2:
    print(f"Syntax: <filename> {sys.argv}")
    exit(-3)

fileName = sys.argv[1]
if not os.path.exists(fileName):
    print(f"File {fileName} does not exist")
    exit(-3)

lines = []
with open(fileName) as f:
    lines = f.readlines()


print(f"Processing {fileName}")
headerTitleMark = "# "
title = [l for l in lines if l.startswith(headerTitleMark)][0]

# Remove Title Mark
title = re.sub(headerTitleMark, "", title)
print(title)

replaceTitleMark = "REPLACETITLE"


def replaceTitle(s):
    if s.startswith(replaceTitleMark):
        print(f"REPLACED {fileName} to {title}")
        s = f"title: {title}"
    return s


lines = [replaceTitle(l) for l in lines]

with open(fileName, "w") as f:
    f.writelines(lines)


print(f"Done processing {fileName}")

# For each markdown file, prepend the corret header
# fd  -e md  -exec sed -i '1s;^;---\nlayout: post\nno-render-title: true\n---\n\n_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/{})_\n\n;' {}
# Remove the trailing md
# fd  -e md  -exec sed -i 's;](\(notes/.*\)\.md;](\1;' {}
# Really Hacky (Ha), index is copied from readme, so put that back.
# sed -i 's;blob/master/index.md;;' index.md
