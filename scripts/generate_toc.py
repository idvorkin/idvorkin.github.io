#!/usr/bin/env python3
"""Generate table of contents for markdown files, particularly the manager book."""

import argparse
import re
import sys
from pathlib import Path

# File paths for manager book
MANAGER_BOOK_MAIN = Path("_posts/2016-03-03-the-manager-book-2.md")
MANAGER_BOOK_APPENDIX = Path("_d/manager-book-appendix.md")


def extract_headers(content: str) -> list[tuple[int, str, str]]:
    """Extract headers from markdown content.
    
    Returns list of (level, text, anchor) tuples.
    """
    headers = []
    
    # Match markdown headers (# Header, ## Header, etc.)
    header_pattern = re.compile(r"^(#{1,6})\s+(.+)$", re.MULTILINE)
    
    for match in header_pattern.finditer(content):
        level = len(match.group(1))
        text = match.group(2).strip()
        
        # Generate anchor from text (similar to Jekyll/GitHub)
        anchor = text.lower()
        anchor = re.sub(r"[^\w\s-]", "", anchor)  # Remove special chars
        anchor = re.sub(r"\s+", "-", anchor)  # Replace spaces with hyphens
        anchor = re.sub(r"-+", "-", anchor)  # Collapse multiple hyphens
        anchor = anchor.strip("-")  # Remove leading/trailing hyphens
        
        headers.append((level, text, anchor))
    
    return headers


def generate_toc(headers: list[tuple[int, str, str, str]], min_level: int = 1, max_level: int = 6) -> str:
    """Generate table of contents from headers list with optional URL prefix."""
    if not headers:
        return ""
    
    toc = []
    
    for level, text, anchor, url_prefix in headers:
        if min_level <= level <= max_level:
            indent = "  " * (level - min_level)
            if url_prefix:
                # Special case: if url_prefix is just an anchor reference
                if url_prefix.startswith("#"):
                    toc.append(f"{indent}- [{text}]({url_prefix})")
                else:
                    toc.append(f"{indent}- [{text}]({url_prefix}#{anchor})")
            else:
                toc.append(f"{indent}- [{text}](#{anchor})")
    
    return "\n".join(toc)


def generate_merged_toc(main_file: Path, appendix_file: Path, for_appendix: bool = False) -> str:
    """Generate a merged TOC from both main and appendix files.
    
    Args:
        main_file: Path to main manager book file
        appendix_file: Path to appendix file
        for_appendix: If True, generate TOC for appendix (links to main), 
                     if False, generate for main (appendix items link to #appendix)
    """
    # Extract headers from both files
    main_content = main_file.read_text()
    appendix_content = appendix_file.read_text()
    
    # Remove existing TOCs before extracting headers
    toc_start_pattern = r"<!-- vim-markdown-toc-start -->"
    toc_end_pattern = r"<!-- vim-markdown-toc-end -->"
    
    main_clean = re.sub(
        f"{toc_start_pattern}.*?{toc_end_pattern}",
        "",
        main_content,
        flags=re.DOTALL
    )
    
    appendix_clean = re.sub(
        f"{toc_start_pattern}.*?{toc_end_pattern}",
        "",
        appendix_content,
        flags=re.DOTALL
    )
    
    main_headers = extract_headers(main_clean)
    appendix_headers = extract_headers(appendix_clean)
    
    # Filter out main titles (H1)
    if main_headers and main_headers[0][0] == 1:
        main_headers = main_headers[1:]
    if appendix_headers and appendix_headers[0][0] == 1:
        appendix_headers = appendix_headers[1:]
    
    # Prepare headers with URL prefixes
    combined_headers = []
    
    if for_appendix:
        # For appendix page: main content needs /manager-book prefix
        for level, text, anchor in main_headers:
            combined_headers.append((level, text, anchor, "/manager-book"))
        # Appendix content has no prefix (same page)
        for level, text, anchor in appendix_headers:
            combined_headers.append((level, text, anchor, ""))
    else:
        # For main page: main content has no prefix (same page)
        has_appendix_header = False
        for level, text, anchor in main_headers:
            combined_headers.append((level, text, anchor, ""))
            if text.lower() == "appendix":
                has_appendix_header = True
        
        # Add Appendix entry if not already present
        if not has_appendix_header:
            combined_headers.append((2, "Appendix", "appendix", ""))
        
        # Appendix sub-items all link to the #appendix section
        for level, text, anchor in appendix_headers:
            # All appendix items link to the main #appendix section
            combined_headers.append((level, text, anchor, "#appendix"))
    
    return generate_toc(combined_headers, min_level=2, max_level=3)


def update_manager_book_toc(file_path: Path) -> bool:
    """Update table of contents in manager book files with merged TOC.
    
    Returns True if file was modified, False otherwise.
    """
    content = file_path.read_text()
    
    # Look for existing TOC markers
    toc_start_pattern = r"<!-- vim-markdown-toc-start -->"
    toc_end_pattern = r"<!-- vim-markdown-toc-end -->"
    
    # Determine if this is the appendix
    is_appendix = file_path == MANAGER_BOOK_APPENDIX
    
    # Generate merged TOC
    new_toc = generate_merged_toc(MANAGER_BOOK_MAIN, MANAGER_BOOK_APPENDIX, for_appendix=is_appendix)
    
    if not new_toc:
        print(f"Warning: No headers found for merged TOC")
        return False
    
    # Create the full TOC block
    toc_block = f"{toc_start_pattern}\n\n{new_toc}\n\n{toc_end_pattern}"
    
    # Check if TOC markers exist
    if toc_start_pattern in content and toc_end_pattern in content:
        # Replace existing TOC
        pattern = f"{toc_start_pattern}.*?{toc_end_pattern}"
        new_content = re.sub(pattern, toc_block, content, flags=re.DOTALL)
    else:
        # Insert new TOC after front matter and first paragraph
        lines = content.split("\n")
        insert_pos = 0
        
        # Skip front matter
        if lines[0] == "---":
            for i in range(1, len(lines)):
                if lines[i] == "---":
                    insert_pos = i + 1
                    break
        
        # Skip empty lines and first paragraph after front matter
        while insert_pos < len(lines) and not lines[insert_pos].strip():
            insert_pos += 1
        
        # Find first header or paragraph after title
        for i in range(insert_pos, len(lines)):
            if lines[i].strip() and not lines[i].startswith("#"):
                # Found first paragraph, insert after it
                insert_pos = i + 1
                while insert_pos < len(lines) and lines[insert_pos].strip():
                    insert_pos += 1
                break
            elif lines[i].startswith("#"):
                # Found a header, insert before it
                insert_pos = i
                break
        
        # Insert the TOC with proper spacing
        lines.insert(insert_pos, "")
        lines.insert(insert_pos + 1, "<!-- prettier-ignore-start -->")
        lines.insert(insert_pos + 2, toc_block)
        lines.insert(insert_pos + 3, "<!-- prettier-ignore-end -->")
        lines.insert(insert_pos + 4, "")
        
        new_content = "\n".join(lines)
    
    # Write back if changed
    if new_content != content:
        file_path.write_text(new_content)
        return True
    
    return False


def cmd_manager_book():
    """Update TOC for manager book posts with merged TOC."""
    files = [MANAGER_BOOK_MAIN, MANAGER_BOOK_APPENDIX]
    
    # Check both files exist
    for file in files:
        if not file.exists():
            print(f"Error: File not found: {file}", file=sys.stderr)
            return 1
    
    # Update both files with merged TOC
    for file in files:
        print(f"Processing {file}")
        
        if update_manager_book_toc(file):
            print(f"✓ Updated TOC in {file}")
        else:
            print(f"No changes needed for {file}")
    
    return 0


def cmd_check():
    """Check manager book files and show what TOC would be generated."""
    files = [MANAGER_BOOK_MAIN, MANAGER_BOOK_APPENDIX]
    
    # Check both files exist
    for file in files:
        if not file.exists():
            print(f"Error: File not found: {file}", file=sys.stderr)
            return 1
    
    # Generate and display merged TOC
    print("Generating merged TOC for manager book...")
    
    # Show TOC for main page
    print("\n=== TOC for Main Manager Book ===")
    main_toc = generate_merged_toc(MANAGER_BOOK_MAIN, MANAGER_BOOK_APPENDIX, for_appendix=False)
    print(main_toc[:2000] if len(main_toc) > 2000 else main_toc)
    if len(main_toc) > 2000:
        print(f"... (truncated, total {len(main_toc)} chars)")
    
    # Show TOC for appendix
    print("\n=== TOC for Manager Book Appendix ===")
    appendix_toc = generate_merged_toc(MANAGER_BOOK_MAIN, MANAGER_BOOK_APPENDIX, for_appendix=True)
    print(appendix_toc[:2000] if len(appendix_toc) > 2000 else appendix_toc)
    if len(appendix_toc) > 2000:
        print(f"... (truncated, total {len(appendix_toc)} chars)")
    
    return 0


def main():
    parser = argparse.ArgumentParser(description="Generate table of contents for manager book")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # Add subcommands
    subparsers.add_parser("manager-book", help="Update TOC for manager book posts")
    subparsers.add_parser("check", help="Check and display what TOC would be generated")
    
    args = parser.parse_args()
    
    if args.command == "manager-book":
        return cmd_manager_book()
    elif args.command == "check":
        return cmd_check()
    else:
        parser.print_help()
        return 1


if __name__ == "__main__":
    sys.exit(main())