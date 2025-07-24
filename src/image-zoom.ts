/**
 * Image Zoom functionality for blog posts
 * Automatically wraps images in blog posts with GLightbox functionality
 */

declare global {
  interface Window {
    GLightbox: any;
  }
}

export function enableImageZoom(retryCount = 0) {
  // Skip if running in test environment without DOM
  if (typeof document === "undefined") {
    return;
  }

  console.log("🖼️ Enabling image zoom functionality");

  // Wait for GLightbox to be available with retry limit
  if (typeof window.GLightbox === "undefined") {
    if (retryCount < 50) {
      // Max 5 seconds of retries (50 * 100ms)
      console.warn(`⚠️ GLightbox not found, retrying in 100ms (attempt ${retryCount + 1}/50)`);
      setTimeout(() => enableImageZoom(retryCount + 1), 100);
      return;
    }
    console.error("❌ GLightbox failed to load after 5 seconds, aborting image zoom initialization");
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

  // Initialize GLightbox for all .glightbox elements (including any existing ones)
  try {
    const lightbox = window.GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
      autoplayVideos: true,
    });

    if (processedCount > 0) {
      console.log(`🎉 Image zoom enabled for ${processedCount} images`);
    } else {
      console.log("ℹ️ No images needed processing, but GLightbox initialized for existing elements");
    }
  } catch (error) {
    console.error("Error initializing GLightbox:", error);
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => enableImageZoom());
  } else {
    // DOM already loaded, but wait a bit for dynamic content
    setTimeout(() => enableImageZoom(), 500);
  }
}
