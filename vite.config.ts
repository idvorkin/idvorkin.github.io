import { defineConfig } from "vite";
import { resolve } from "path";

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
        // Ensure consistent output filename
        entryFileNames: "index.js",
      },
    },
  },
});
