import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "BlogBundle",
      fileName: () => "index.js",
      formats: ["es"],
    },
    outDir: "assets/js",
    sourcemap: true,
    minify: true,
    emptyOutDir: false, // Don't delete vendor/ directory
    rollupOptions: {
      output: {
        // Stable, unhashed chunk names. The build output is committed to git and
        // emptyOutDir is false, so hashed names (index-2MtC4l1p.js) would leave a
        // new orphan file behind on every build.
        chunkFileNames: "[name].js",
        manualChunks(id) {
          // MiniSearch powers typo-tolerant title search and is only loaded when
          // someone actually searches — keep it out of the main bundle.
          if (id.includes("node_modules/minisearch")) return "minisearch";
        },
      },
    },
  },
});
