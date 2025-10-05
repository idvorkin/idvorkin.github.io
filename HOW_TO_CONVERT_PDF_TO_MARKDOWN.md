# How to Convert Multi-Column PDFs to Markdown

This guide shows how to convert complex PDFs (especially multi-column academic papers, reports, etc.) to clean markdown format with extracted images.

## The Problem

Basic tools like `pdftotext` don't handle multi-column layouts well. They merge columns line-by-line instead of reading each column fully, resulting in scrambled text:

```
Column 1 Line 1    Column 2 Line 1
Column 1 Line 2    Column 2 Line 2
```

Instead of:
```
Column 1 Line 1
Column 1 Line 2

Column 2 Line 1
Column 2 Line 2
```

## The Solution: Marker

[Marker](https://github.com/VikParuchuri/marker) is an AI-powered PDF to markdown converter that uses machine learning models to properly understand document layout, tables, and text flow.

## Installation

### Prerequisites
- Python 3.9+
- `uv` package manager (recommended for this project)

### Install Marker

```bash
# If using uv (recommended)
uv tool install marker-pdf

```

### First Run Model Downloads

The first time you run Marker, it will download ~3GB of ML models:
- Layout detection model (1.35GB)
- Text recognition model (1.34GB)
- Table recognition model (201MB)
- Text detection model (73.4MB)
- OCR error detection model (258MB)

Models are cached in `~/Library/Caches/datalab/models/` (macOS) or `~/.cache/` (Linux).

**Important**: Ensure you have at least **5GB free disk space** before running Marker for the first time.

## Basic Usage

### Convert a Single PDF

```bash
marker_single your_file.pdf --output_dir ./output
```

This creates:
- `output/your_file.md` - The markdown file
- `output/your_file_meta.json` - Conversion metadata
- `output/_page_N_Figure_X.jpeg` - Extracted images

### Command Options

```bash
# Specify output directory
marker_single file.pdf --output_dir ./my_output

# Process in background (for large files)
marker_single large_file.pdf --output_dir . 2>&1 &

# Check if it's still running
ps aux | grep marker_single
```

## Complete Workflow Example

Here's the complete workflow used to convert the World Happiness Report 2025:

### 1. Download the PDF

```bash
# Create working directory
mkdir -p ~/pdf_conversions
cd ~/pdf_conversions

# Download the PDF
curl -L -o WHR25.pdf https://files.worldhappiness.report/WHR25.pdf
```

### 2. Extract Images (Optional - for filtering specific types)

If you want to extract and filter images separately (e.g., only graphs, not photos):

```bash
# Extract all images from PDF
mkdir -p whr_images
pdfimages -all WHR25.pdf whr_images/whr

# This creates: whr-000.png, whr-001.jpg, etc.
```

Then use AI or manual review to identify which images are graphs vs photos.

### 3. Convert PDF to Markdown with Marker

```bash
# Convert the PDF
marker_single WHR25.pdf --output_dir .

# This creates:
# - WHR25/WHR25.md (the markdown file)
# - WHR25/_page_N_Figure_X.jpeg (all extracted images)
# - WHR25/WHR25_meta.json (conversion metadata)
```

### 4. Review the Output

```bash
# Check the markdown file
head -100 WHR25/WHR25.md

# See all extracted images
ls WHR25/*.jpeg | wc -l

# Check file sizes
ls -lh WHR25/WHR25.md
```

## Expected Processing Time

For a **263-page PDF**:
- **Model download** (first time only): ~5-10 minutes (depending on internet speed)
- **PDF processing**: ~20-40 minutes (depends on CPU/GPU)
  - Layout detection
  - Text recognition
  - Table recognition
  - OCR error detection
  - Image extraction

Progress will show in terminal:
```
Running OCR Error Detection:  23%|██▎  | 15/65 [00:02<00:03, 11.04it/s]
```

## Troubleshooting


### Process Takes Too Long

```bash
# Run in background and check output periodically
marker_single file.pdf --output_dir . > conversion.log 2>&1 &

# Check progress
tail -f conversion.log

# Or check if still running
ps aux | grep marker_single
```

### Models Download Slowly

The models are hosted on Hugging Face. If download is slow:
- Check your internet connection
- Consider downloading during off-peak hours
- Models are cached after first download, so this only happens once

### Marker Not Found After Installation

```bash
# If using uv, ensure uv bin directory is in PATH
export PATH="$HOME/.local/bin:$PATH"

# Or use full path
~/.local/bin/marker_single file.pdf --output_dir .
```

## Output Quality

Marker provides excellent quality for:
- ✅ Multi-column layouts (academic papers, reports)
- ✅ Tables (converted to markdown tables)
- ✅ Figures and images (extracted with references)
- ✅ Headers and formatting
- ✅ Mathematical equations (basic)
- ✅ Complex document structures

May have issues with:
- ⚠️ Hand-written content
- ⚠️ Very complex mathematical equations
- ⚠️ Scanned documents with poor quality
- ⚠️ Non-English text (depending on the model)

## Alternative Tools

If Marker doesn't work for your use case:

### For Simple PDFs (single column, text-only)
```bash
# pdftotext (fast, but poor layout handling)
pdftotext -layout file.pdf output.txt
```

### For HTML-first PDFs
```bash
# pdftohtml (preserves layout as HTML)
pdftohtml -c file.pdf output.html
```

### For OCR of Scanned Documents
```bash
# tesseract (OCR engine)
brew install tesseract
tesseract scan.pdf output.txt
```


## Best Practices

1. **Always check output quality** - Review the first few pages of the markdown to ensure proper conversion

2. **Keep original PDF** - Don't delete the source PDF in case you need to re-convert

3. **Organize output** - Use descriptive output directory names:
   ```bash
   marker_single report.pdf --output_dir report_2025_converted
   ```

4. **Version control for scripts** - If you're processing many PDFs, create a script and version it

5. **Document your process** - Keep notes on which settings work best for your document types

## Example Script for Batch Processing

```bash
#!/bin/bash
# batch_convert.sh - Convert multiple PDFs

for pdf in *.pdf; do
    echo "Converting $pdf..."
    base=$(basename "$pdf" .pdf)
    marker_single "$pdf" --output_dir "${base}_converted"
    echo "✓ Completed $pdf"
done

echo "All conversions complete!"
```

Usage:
```bash
chmod +x batch_convert.sh
./batch_convert.sh
```

## Resources

- **Marker GitHub**: https://github.com/VikParuchuri/marker
- **Marker Documentation**: https://github.com/VikParuchuri/marker/blob/master/README.md
- **Issues/Support**: https://github.com/VikParuchuri/marker/issues

## Real-World Example: World Happiness Report 2025

### Input
- PDF: 263 pages, multi-column layout, 155 images
- Size: 22 MB
- URL: https://files.worldhappiness.report/WHR25.pdf

### Output
- Markdown: 653 KB, properly formatted
- Images: 155 JPEG files (all figures, charts, and diagrams)
- Quality: Excellent - no column-merge issues

### Processing Stats
- Model download: ~5 minutes (first time only)
- Conversion time: ~20 minutes
- Disk space used: ~3.5 GB (models + output)

### Commands Used
```bash
# Download PDF
curl -L -o WHR25.pdf https://files.worldhappiness.report/WHR25.pdf

# Convert to markdown
marker_single WHR25.pdf --output_dir .

# Result: WHR25/WHR25.md + 155 image files
```

---

**Last Updated:** October 5, 2025
**Tested With:** Marker v0.3.x, Python 3.11, macOS & Linux
