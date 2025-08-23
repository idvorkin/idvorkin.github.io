#!/usr/bin/env python3
import os
import re
import yaml
from collections import Counter, defaultdict

def extract_frontmatter(content):
    # Match frontmatter between --- blocks
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if match:
        try:
            return yaml.safe_load(match.group(1))
        except:
            return {}
    return {}

# Initialize data structures
all_tags = Counter()
featured_posts = []
search_featured_posts = []
post_data = []
tag_to_posts = defaultdict(list)

# Process all markdown files
posts_dir = '/home/runner/work/idvorkin.github.io/idvorkin.github.io/_posts'
for filename in os.listdir(posts_dir):
    if filename.endswith('.md') or filename.endswith('.markdown'):
        filepath = os.path.join(posts_dir, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        frontmatter = extract_frontmatter(content)
        
        # Extract relevant data
        title = frontmatter.get('title', filename)
        tags = frontmatter.get('tags', [])
        featured = frontmatter.get('featured', False)
        inprogress = frontmatter.get('inprogress', False)
        
        # Store post data
        post_info = {
            'filename': filename,
            'title': title,
            'tags': tags,
            'featured': featured,
            'inprogress': inprogress,
            'permalink': frontmatter.get('permalink', ''),
            'date': frontmatter.get('date', ''),
        }
        post_data.append(post_info)
        
        # Count tags
        if tags:
            for tag in tags:
                all_tags[tag] += 1
                tag_to_posts[tag].append({
                    'filename': filename,
                    'title': title,
                    'featured': featured
                })
        
        # Track featured posts
        if featured:
            featured_posts.append(post_info)
            
        # Track search-featured posts
        if tags and 'search-featured' in tags:
            search_featured_posts.append(post_info)

# Print comprehensive analysis
print('=== BLOG POST TAG ANALYSIS ===')
print(f'Total posts: {len(post_data)}')
print(f'Total unique tags: {len(all_tags)}')
print(f'Posts marked featured: {len(featured_posts)}')
print(f'Posts with search-featured tag: {len(search_featured_posts)}')

print('\n=== MOST POPULAR TAGS (Top 20) ===')
for tag, count in all_tags.most_common(20):
    print(f'{tag}: {count} posts')

print('\n=== FEATURED POSTS ===')
for post in featured_posts:
    print(f'• {post["title"]} ({post["filename"]})')
    if post['tags']:
        print(f'  Tags: {", ".join(post["tags"])}')

print('\n=== SEARCH-FEATURED POSTS ===')
for post in search_featured_posts:
    print(f'• {post["title"]} ({post["filename"]})')

print('\n=== ALL POSTS WITH THEIR TAGS ===')
for post in sorted(post_data, key=lambda x: x['filename']):
    status = []
    if post['featured']:
        status.append('FEATURED')
    if post['inprogress']:
        status.append('IN_PROGRESS')
    status_str = f" [{', '.join(status)}]" if status else ""
    
    print(f'{post["filename"]}: {post["title"]}{status_str}')
    if post['tags']:
        print(f'  Tags: {", ".join(post["tags"])}')
    print()