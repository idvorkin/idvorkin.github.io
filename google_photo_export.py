# google_photos_to_jekyll_single_post.py

import json
import os
import shutil
import zipfile
from datetime import datetime


def extract_google_photos(input_zip, output_folder):
    with zipfile.ZipFile(input_zip, "r") as zip_ref:
        zip_ref.extractall(output_folder)

    metadata_files = []
    for root, dirs, files in os.walk(output_folder):
        for file in files:
            if file.endswith(".json"):
                metadata_files.append(os.path.join(root, file))

    return metadata_files


def parse_metadata(metadata_files, extracted_photos_folder, jekyll_img_folder):
    elements = []
    for metadata_file in metadata_files:
        with open(metadata_file, "r") as f:
            metadata = json.load(f)

            if "description" in metadata:
                elements.append(
                    ("text", metadata["creationTime"], metadata["description"])
                )

            if "photo" in metadata:
                photo_filename = metadata["filename"]
                elements.append(("photo", metadata["creationTime"], photo_filename))
                shutil.copy2(
                    os.path.join(extracted_photos_folder, photo_filename),
                    os.path.join(jekyll_img_folder, photo_filename),
                )

    elements.sort(key=lambda x: x[1])
    return elements


def create_jekyll_post(elements, jekyll_posts_folder):
    post_date = datetime.now().strftime("%Y-%m-%d")
    post_filename = f"{post_date}-google-photos-album.markdown"

    with open(os.path.join(jekyll_posts_folder, post_filename), "w") as f:
        f.write("---\n")
        f.write("title: Google Photos Album\n")
        f.write(f"date: {post_date}\n")
        f.write("---\n\n")

        for element in elements:
            if element[0] == "photo":
                f.write(f"![Photo]({{ site.baseurl }}/assets/img/{element[2]})\n\n")
            elif element[0] == "text":
                f.write(f"{element[2]}\n\n")


def generate_jekyll_blog(metadata_files, extracted_photos_folder, jekyll_folder):
    jekyll_posts_folder = os.path.join(jekyll_folder, "_posts")
    jekyll_img_folder = os.path.join(jekyll_folder, "assets", "img")
    os.makedirs(jekyll_img_folder, exist_ok=True)

    elements = parse_metadata(
        metadata_files, extracted_photos_folder, jekyll_img_folder
    )
    create_jekyll_post(elements, jekyll_posts_folder)

    print("Generated single Jekyll blog post with photos and text.")


if __name__ == "__main__":
    input_zip = "path/to/your/google_photos.zip"
    output_folder = "path/to/extracted_photos"
    os.makedirs(output_folder, exist_ok=True)
    metadata_files = extract_google_photos(input_zip, output_folder)

    jekyll_folder = "path/to/my-jekyll-blog"
    generate_jekyll_blog(metadata_files, output_folder, jekyll_folder)
