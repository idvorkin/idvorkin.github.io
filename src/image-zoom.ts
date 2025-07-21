/**
 * Image Zoom functionality for blog posts
 * Automatically wraps images in blog posts with GLightbox functionality
 */

declare global {
  interface Window {
    GLightbox: any;
  }
}

export function enableImageZoom() {
  console.log("🖼️ Enabling image zoom functionality");

  // Add visible indicator that function is called
  const indicator = document.createElement("div");
  indicator.style.cssText =
    "position: fixed; top: 10px; right: 10px; background: yellow; padding: 10px; z-index: 9999;";
  indicator.textContent = "Image zoom initializing...";
  document.body.appendChild(indicator);

  // Wait for GLightbox to be available
  if (typeof window.GLightbox === "undefined") {
    console.warn("⚠️ GLightbox not found, retrying in 100ms");
    setTimeout(enableImageZoom, 100);
    return;
  }

  // Find all images in the main content area (excluding headers, sidebars, etc.)
  const contentSelectors = [
    "p img", // Images inside paragraphs (most common in markdown)
    "li img", // Images inside list items
    ".container img",
    ".post-content img",
    "article img",
    ".markdown-body img",
    "main img",
  ];

  const images = document.querySelectorAll(contentSelectors.join(", "));
  console.log(`🔍 Found ${images.length} images to process`);

  let processedCount = 0;

  images.forEach((img, index) => {
    const imageElement = img as HTMLImageElement;

    // Skip if already wrapped in a link
    if (imageElement.parentElement?.tagName === "A") {
      console.log(`⏭️ Skipping image ${index + 1} - already wrapped`);
      return;
    }

    // Skip tiny images (likely icons)
    if (imageElement.naturalWidth > 0 && imageElement.naturalWidth < 100 && imageElement.naturalHeight < 100) {
      console.log(
        `⏭️ Skipping image ${index + 1} - too small (${imageElement.naturalWidth}x${imageElement.naturalHeight})`,
      );
      return;
    }

    // Create wrapper link
    const link = document.createElement("a");
    link.href = imageElement.src;
    link.className = "glightbox";
    link.setAttribute("data-gallery", "post-images");

    // Add description from alt text if available
    if (imageElement.alt) {
      link.setAttribute("data-description", imageElement.alt);
    }

    // Wrap the image
    imageElement.parentNode?.insertBefore(link, imageElement);
    link.appendChild(imageElement);

    processedCount++;
    console.log(
      `✅ Processed image ${index + 1}: ${imageElement.src.substring(imageElement.src.lastIndexOf("/") + 1)}`,
    );
  });

  if (processedCount > 0) {
    // Initialize or refresh GLightbox
    const lightbox = window.GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
      autoplayVideos: true,
    });

    console.log(`🎉 Image zoom enabled for ${processedCount} images`);

    // Update indicator
    indicator.textContent = `✅ Image zoom enabled for ${processedCount} images`;
    indicator.style.background = "#90EE90";
    setTimeout(() => indicator.remove(), 3000);
  } else {
    console.log("ℹ️ No images needed processing");
    indicator.textContent = "ℹ️ No images needed processing";
    indicator.style.background = "#FFE4B5";
    setTimeout(() => indicator.remove(), 3000);
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enableImageZoom);
  } else {
    // DOM already loaded, but wait a bit for dynamic content
    setTimeout(enableImageZoom, 500);
  }
}
