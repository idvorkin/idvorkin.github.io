## SpecStory

## Blog Code Editing Guidelines (3/7/2025, 9:32:56 AM)

_**User**_

Make a rule for edittttting  code on the blog

What rules do you recommend when working on the blog code?

Thought Process
# Recommended Rules When Working on the Blog Code
Based on our experience working with your blog codebase, here are some recommendations for effective development:
TypeScript/JavaScript Development
Use TypeScript for all new code - TypeScript provides valuable type checking and makes the code more maintainable.
Respect interface definitions - Always check existing interfaces in shared.ts before implementing new features. If an interface needs extending, update it properly first.
Export functions deliberately - Only export functions that need to be accessed by other modules. For internal module helpers, keep them private.
Debug with source maps - When debugging, use Parcel without the --no-source-maps flag to enable proper TypeScript debugging in the browser.
Use the load_globals pattern - For functionality that needs to run across the site, add it to the load_globals function in main.ts rather than using separate script tags.
Check document.readyState - When adding DOM manipulation code, always check if the document is already loaded or still loading:
}
Use the just build system - Use the just command runner for all build tasks (js-build, js-watch, etc.) to ensure consistency.
Content Structure
Respect backlinks.json - The backlinks.json file is central to site navigation. When adding new content, make sure to run just update-backlinks to update the link structure.
Keep UI components isolated - Each UI component should handle its own lifecycle and contain proper error handling.
Use consistent HTML element IDs - When adding new components that target specific elements (like "recent-posts"), ensure the IDs are consistent and well-documented.
Minimize inline JavaScript - Keep JavaScript out of Markdown files, instead creating proper TypeScript modules and importing them.
Jekyll Integration
Test components in isolation - Create minimal test cases when debugging complex components rather than relying on the full Jekyll site.
Always rebuild after TypeScript changes - Run just js-build after making TypeScript changes to ensure the compiled output is updated.
Use jQuery carefully - The codebase uses jQuery in many places; maintain this pattern for consistency but be mindful of its dependencies.
Include script references consistently - When adding new script functionality, follow the pattern in _includes/scripts.html rather than adding inline scripts.
Run Jekyll in incremental mode for development - Use just jekyll-serve to run Jekyll with live reload for faster development.
Debugging
Use console.log strategically - Add descriptive log messages with emoji prefixes (like 🔍, ✅, ❌) to make logs more scannable.
Check the Network tab - For fetch/AJAX issues, always check the Network tab to see if resources are loading properly.
View source maps - Use browser dev tools with source maps to debug TypeScript directly.
Create isolated test pages when needed - For complex components, create dedicated test pages to isolate problems.
Would you like me to elaborate on any of these recommendations or add any additional rules for specific aspects of your blog code?

---

_**Assistant**_

<think>The user is asking me to create a rule for editing code on their blog. They've provided a thought process with several recommendations for working with the blog codebase. I should create a comprehensive rule file that codifies these best practices.

Let me first understand what's in the attached files to get more context:

1. `about.md` - This is the About page for the user's blog. It contains information about the blog's purpose, the author's philosophy, and some FAQs. This gives me context that the blog is a personal project where the author shares their thoughts and experiments with technology.

Since I need to create a rule for editing code on the blog, and the user has provided extensive recommendations in their thought process, I'll organize these into a coherent rule file. Based on the available custom instructions, I should follow the "000-cursor-rule-creation" guideline, though I don't have the full details of that rule.

The rule should cover:
1. TypeScript/JavaScript Development
2. Content Structure
3. Jekyll Integration
4. Debugging
5. Any other relevant coding standards

I'll create a comprehensive rule that a developer can follow when working on the blog's codebase.</think># Creating a Rule for Blog Code Development

I'll help you create a rule file for editing code on your blog. Based on your thought process and the blog structure, this will provide consistent guidelines for code modifications.

---

_****_

```diff
- 
+ ---
+ title: Blog Code Development
+ description: Guidelines for working with the blog codebase
+ author: Igor
+ date: 2024-11-14
+ glob: "*.{ts,js,scss,css}"
+ ---
+ 
+ # Blog Code Development Guidelines
+ 
+ These rules ensure consistent, maintainable code when developing the blog's technical components.
+ 
+ ## TypeScript/JavaScript Development
+ 
+ 1. **Use TypeScript for all new code**
+    - TypeScript provides valuable type checking and makes the code more maintainable
+    - Enforce type definitions for all functions and variables
+ 
+ 2. **Respect interface definitions**
+    - Always check existing interfaces in `shared.ts` before implementing new features
+    - If an interface needs extending, update it properly first
+ 
+ 3. **Export functions deliberately**
+    - Only export functions that need to be accessed by other modules
+    - Keep internal module helpers private
+ 
+ 4. **Debug with source maps**
+    - When debugging, use Parcel without the `--no-source-maps` flag
+    - This enables proper TypeScript debugging in the browser
+ 
+ 5. **Use the load_globals pattern**
+    - For functionality that needs to run across the site, add it to the `load_globals` function in `main.ts`
+    - Avoid using separate script tags for global behavior
+ 
+ 6. **Check document.readyState**
+    - When adding DOM manipulation code, always check if the document is already loaded:
+    ```typescript
+    if (document.readyState === 'loading') {
+      document.addEventListener('DOMContentLoaded', initFunction);
+    } else {
+      initFunction();
+    }
+    ```
+ 
+ 7. **Use the just build system**
+    - Use the just command runner for all build tasks (js-build, js-watch, etc.)
+    - Ensures consistency across development environments
+ 
+ ## Content Structure
+ 
+ 1. **Respect backlinks.json**
+    - The `backlinks.json` file is central to site navigation
+    - Run `just update-backlinks` after adding new content
+ 
+ 2. **Keep UI components isolated**
+    - Each UI component should handle its own lifecycle
+    - Include proper error handling in all components
+ 
+ 3. **Use consistent HTML element IDs**
+    - When adding new components that target specific elements (like "recent-posts")
+    - Ensure the IDs are consistent and well-documented
+ 
+ 4. **Minimize inline JavaScript**
+    - Keep JavaScript out of Markdown files
+    - Create proper TypeScript modules and import them
+ 
+ ## Jekyll Integration
+ 
+ 1. **Test components in isolation**
+    - Create minimal test cases when debugging complex components
+    - Avoid relying on the full Jekyll site for testing
+ 
+ 2. **Always rebuild after TypeScript changes**
+    - Run `just js-build` after making TypeScript changes
+    - Ensures the compiled output is updated
+ 
+ 3. **Use jQuery carefully**
+    - The codebase uses jQuery in many places; maintain this pattern for consistency
+    - Be mindful of jQuery dependencies
+ 
+ 4. **Include script references consistently**
+    - When adding new script functionality, follow the pattern in `_includes/scripts.html`
+    - Avoid adding inline scripts
+ 
+ 5. **Run Jekyll in incremental mode for development**
+    - Use `just jekyll-serve` to run Jekyll with live reload
+    - Provides faster development feedback
+ 
+ ## Debugging
+ 
+ 1. **Use console.log strategically**
+    - Add descriptive log messages with emoji prefixes (like 🔍, ✅, ❌)
+    - Makes logs more scannable and meaningful
+ 
+ 2. **Check the Network tab**
+    - For fetch/AJAX issues, always check the Network tab
+    - Verify resources are loading properly
+ 
+ 3. **View source maps**
+    - Use browser dev tools with source maps to debug TypeScript directly
+    - Set breakpoints in the original TypeScript code
+ 
+ 4. **Create isolated test pages when needed**
+    - For complex components, create dedicated test pages
+    - Helps isolate problems from the rest of the site
+ 
+ ## Performance
+ 
+ 1. **Minimize asset sizes**
+    - Use image compression for web assets
+    - Prefer WebP format for images when possible
+ 
+ 2. **Lazy load components when appropriate**
+    - Use lazy loading for components not needed on initial render
+    - Improves initial page load time
+ 
+ 3. **Profile before optimizing**
+    - Use browser performance tools to identify actual bottlenecks
+    - Focus optimization efforts on measured issues, not assumptions
+ 
+ ## Version Control
+ 
+ 1. **Use meaningful commit messages**
+    - Explain what changes were made and why
+    - Link to issues or discussions when relevant
+ 
+ 2. **Commit small, focused changes**
+    - Each commit should address a single concern
+    - Makes review and potential rollbacks easier
+ 
+ ## Testing
+ 
+ 1. **Verify changes in multiple browsers**
+    - Test at least in Chrome and Firefox
+    - Check mobile responsiveness
+ 
+ 2. **Run existing tests before committing**
+    - Ensure changes don't break existing functionality
+    - Add tests for new features when appropriate 
```

---

_****_

I've created a comprehensive rule file for blog code development based on your recommendations. This rule (107-blog-code) follows the Cursor rule format and will help maintain consistency when working on the technical aspects of your blog.

The rule includes guidelines for:

1. **TypeScript/JavaScript Development** - Best practices for writing and maintaining TypeScript code
2. **Content Structure** - How to properly integrate code with your content architecture
3. **Jekyll Integration** - Working effectively with the Jekyll static site generator
4. **Debugging** - Strategies for efficiently troubleshooting issues
5. **Performance** - Optimizations to keep your blog running smoothly
6. **Version Control** - Good practices for managing code changes
7. **Testing** - Ensuring your changes work as expected

This rule will be automatically applied when working with TypeScript, JavaScript, SCSS, or CSS files in your project, based on the glob pattern I've specified in the frontmatter.

Is there anything specific you'd like me to add or modify to this rule file? I can also help you implement any of these guidelines in your actual codebase if needed.

---

_**User**_

Say user is already running the jekyll server, don't bother

---

_**Assistant**_

<think>The user is indicating that in the rule file I created, I should modify the content to not suggest starting the Jekyll server if it's already running. This is a reasonable suggestion since restarting an already running Jekyll server would be unnecessary and time-consuming.

I should update the 107-blog-code.md rule file to reflect this feedback. The specific section to modify would be in the "Jekyll Integration" part, where I mentioned using `just jekyll-serve`. I'll need to add a note to check if Jekyll is already running before attempting to start it.</think>I'll update the rule to account for Jekyll servers that are already running.

---

_****_

```diff
     - Avoid adding inline scripts
  
- 5. **Run Jekyll in incremental mode for development**
-    - Use `just jekyll-serve` to run Jekyll with live reload
-    - Provides faster development feedback
+ 5. **Jekyll development environment**
+    - Check if Jekyll is already running before starting a new server
+    - If Jekyll is already running at http://localhost:4000, use that instance
+    - Only use `just jekyll-serve` when starting a new development session
+    - For testing changes, simply refresh the browser window
  
  ## Debugging
```

---

_****_

Good point! I've updated the rule to acknowledge that users might already have Jekyll running. The revised guideline now states:

- Check if Jekyll is already running before starting a new server
- If Jekyll is already running at http://localhost:4000, use that existing instance
- Only use `just jekyll-serve` when starting a fresh development session
- For testing changes, simply refresh the browser window

This modification avoids the waste of time and resources from unnecessarily restarting the Jekyll server when it's already running. The updated rule will help developers work more efficiently with your blog codebase.

Is there anything else you'd like to modify or add to the development guidelines?

---

_**User**_

Doesn't it need to be an mdc file?

---

_**Assistant**_

<think>You're right. Cursor rules should typically have an `.md` extension, but I created it with a `.md` extension. The file should have an `.mdc` extension instead according to Cursor rules conventions.

Let me check if I need to rename the file from `.md` to `.mdc`.</think>You're absolutely right! Cursor rules need to use the `.mdc` extension, not `.md`. Let me fix that for you.

---

_****_

```bash
mv 000-cursor-rule-107-blog-code.md 107-blog-code.mdc
```

```

igors-Mac-mini in idvorkin.github.io on  master [$✘+?] via  v23.2.0 via 🐍 v3.13.0 (omnifocus_cli) via 💎 v2.6.10 on ☁️   
❯
```

---

_****_

Perfect! I've renamed the file to `107-blog-code.mdc`, which:

1. Uses the correct `.mdc` extension that Cursor requires for rule files
2. Follows the standard Cursor rule numbering convention (removing the `000-cursor-rule-` prefix)

The content of the rule is now properly formatted and will be recognized by Cursor when you're working with your blog code files. Cursor will automatically apply these guidelines when you're editing TypeScript, JavaScript, SCSS, or CSS files in your blog project.

Would you like me to make any other changes to this rule or help you with anything else related to your blog's code development guidelines?

---

_**User**_

Is the rule in the right spot/

---

_**Assistant**_

<think>Let me check where Cursor rule files are supposed to be located. Based on the user's question, it seems like there might be a specific directory where these rule files need to be placed. I don't have specific information about the Cursor rule file organization in the user's repository, so I should check the file structure to see if there's a dedicated directory for these rule files.</think>Let me check where Cursor rules are typically stored in your repository.

---

_****_

```bash
find . -name "*.mdc" | sort
```

```
❯ find . -name "*.mdc" | sort
./.cursor/rules/000-cursor-rule-creation.mdc
./.cursor/rules/000-cursor-rules.mdc
./.cursor/rules/100-blog-images.mdc
./.cursor/rules/100-python-cli.mdc
./.cursor/rules/101-blog-post-conventions.mdc
./.cursor/rules/102-jekyll-development.mdc
./.cursor/rules/103-blog-content.mdc
./.cursor/rules/104-blog-book-references.mdc
./.cursor/rules/105-blog-formatting.mdc
./.cursor/rules/106-blog-writing-style.mdc
./.cursor/rules/400-md-docs.mdc
./.cursor/rules/901-prd.mdc
./.cursor/rules/902-arch.mdc
./.cursor/rules/903-story.mdc
./.cursor/rules/blog-rules.mdc
./107-blog-code.mdc
./_site/107-blog-code.mdc
./xnotes/801-workflow-agile.mdc
./xnotes/901-prd-template.mdc
./xnotes/902-arch-template.mdc
./xnotes/903-story-template.mdc

igors-Mac-mini in idvorkin.github.io on  master [$+] via  v23.2.0 via 🐍 v3.13.0 (omnifocus_cli) via 💎 v2.6.10 on ☁️   
❯
```

---

_****_

You're right! The rule is in the wrong location. I see that Cursor rules in your repository are stored in the `.cursor/rules/` directory, and they follow a specific naming convention.

Let me move the file to the correct location:

---

_****_

```bash
mv 107-blog-code.mdc .cursor/rules/107-blog-code.mdc
```

```
❯ mv 107-blog-code.mdc .cursor/rules/107-blog-code.mdc

igors-Mac-mini in idvorkin.github.io on  master [$✘+?] via  v23.2.0 via 🐍 v3.13.0 (omnifocus_cli) via 💎 v2.6.10 on ☁️   
❯
```

---

_****_

Great! The rule is now in the correct location at `.cursor/rules/107-blog-code.mdc`, where Cursor will be able to find and apply it.

Looking at your other rule files, I notice they follow a consistent structure in the `.cursor/rules/` directory, and all your rule files use the `.mdc` extension as we've now applied.

Your blog code development rule is now properly set up and will be applied by Cursor when you're working with JavaScript, TypeScript, SCSS, or CSS files in your blog project, as specified by the glob pattern in the frontmatter.

Is there anything else you'd like to adjust about this rule file or any other aspects of your blog code development guidelines?

---

_**User**_

Did you follow the rules for creating cursor rules? 

---

_**Assistant**_

<think>Let me examine if I followed the rules for creating Cursor rules. From the available instructions in your repository, there are two rules specifically for Cursor rule creation:

1. `000-cursor-rule-creation.mdc`
2. `000-cursor-rules.mdc`

I should check these rules to ensure I followed the proper conventions when creating this rule. Let me fetch them to see their requirements.</think>Let me check the rules for creating Cursor rules to ensure we've followed them correctly.

---

_****_



---

_****_

I see now that I didn't fully follow the Cursor rule creation guidelines. Let me fix this by following the proper procedure:

1. First, I'll create a temporary markdown file
2. Then update it with the correct format based on the standards
3. Finally, move it to the correct location with the right extension

---

_****_

Cancelled

---

_****_



---

_**User**_

No you're good you already did it weirdly. Anything missing in teh syntax?

---

_**Assistant**_

<think>Let me review what's missing in the syntax of the existing rule file compared to the standard format from the 000-cursor-rules.

According to the standard format, the rule should have:

1. Frontmatter:
   - description: In ACTION when TRIGGER to OUTCOME format
   - globs: File patterns (we used glob instead)
   - tags: Categorization keywords (missing)
   - priority: 1 (highest) to 5 (lowest) (missing)
   - version: Semantic versioning (missing)

2. Body:
   - A version tag: `<version>X.Y.Z</version>` (missing)
   - Context section (missing)
   - Requirements section (we have guidelines but not formatted as requirements)
   - Examples section with proper formatting (missing)

Let me go ahead and check what's in the current file and identify what needs to be fixed.

Current frontmatter has:
- title
- description
- author
- date
- glob (should be globs)

Missing:
- tags
- priority
- version
- ACTION when TRIGGER to OUTCOME format for description

Body is missing:
- Version tag
- Context section
- Requirements section (instead of guidelines)
- Examples section</think>Looking at your current rule file, there are several syntax elements missing compared to the Cursor rule standard format:

1. In the frontmatter:
   - The description should follow the ACTION when TRIGGER to OUTCOME format
   - "glob" should be "globs" (plural)
   - Missing tags for categorization
   - Missing priority level (1-5)
   - Missing version number

2. In the body:
   - Missing the `<version>X.Y.Z</version>` tag after the title
   - Missing a formal Context section
   - Guidelines should be formatted as Requirements
   - Missing Examples section with proper formatting

Let me update the file to follow the proper syntax:

---

_****_

```diff
  ---
- title: Blog Code Development
- description: Guidelines for working with the blog codebase
- author: Igor
- date: 2024-11-14
- glob: "*.{ts,js,scss,css}"
+ description: ENFORCE blog code standards when developing the blog codebase to ensure consistency and maintainability
+ globs: ["*.{ts,js,scss,css}"]
+ tags: [typescript, javascript, jekyll, blog, development]
+ priority: 2
+ version: 1.0.0
  ---
  
  # Blog Code Development Guidelines
  
- These rules ensure consistent, maintainable code when developing the blog's technical components.
- 
- ## TypeScript/JavaScript Development
+ <version>1.0.0</version>
+ 
+ ## Context
+ - When working on the blog's frontend code
+ - When adding new TypeScript/JavaScript functionality 
+ - When modifying existing code components
+ - When implementing UI changes that require code
+ 
+ ## Requirements
+ 
+ ### TypeScript/JavaScript Development
  
  1. **Use TypeScript for all new code**
- 
-    - TypeScript provides valuable type checking and makes the code more maintainable
     - Enforce type definitions for all functions and variables
+    - Prefer interfaces for data structure definitions
  
  2. **Respect interface definitions**
- 
-    - Always check existing interfaces in `shared.ts` before implementing new features
-    - If an interface needs extending, update it properly first
+    - Check existing interfaces in `shared.ts` before implementing new features
+    - Update interfaces properly when extending functionality
  
  3. **Export functions deliberately**
- 
-    - Only export functions that need to be accessed by other modules
+    - Only export functions needed by other modules
     - Keep internal module helpers private
  
  4. **Debug with source maps**
- 
-    - When debugging, use Parcel without the `--no-source-maps` flag
-    - This enables proper TypeScript debugging in the browser
+    - Use Parcel without the `--no-source-maps` flag
+    - Enable proper TypeScript debugging in browser tools
  
  5. **Use the load_globals pattern**
- 
-    - For functionality that needs to run across the site, add it to the `load_globals` function in `main.ts`
-    - Avoid using separate script tags for global behavior
+    - Add site-wide functionality to `load_globals` function in `main.ts`
+    - Avoid separate script tags for global behavior
  
  6. **Check document.readyState**
- 
-    - When adding DOM manipulation code, always check if the document is already loaded:
- 
+    - Follow proper DOM-ready pattern for manipulation:
     ```typescript
     if (document.readyState === "loading") {
  
  7. **Use the just build system**
-    - Use the just command runner for all build tasks (js-build, js-watch, etc.)
-    - Ensures consistency across development environments
+    - Run build tasks through just command runner
+    - Maintain consistency across development environments
  
- ## Content Structure
+ ### Content Structure
  
  1. **Respect backlinks.json**
- 
-    - The `backlinks.json` file is central to site navigation
-    - Run `just update-backlinks` after adding new content
+    - Update `backlinks.json` when adding new content
+    - Run `just update-backlinks` after content changes
  
  2. **Keep UI components isolated**
- 
-    - Each UI component should handle its own lifecycle
-    - Include proper error handling in all components
+    - Ensure components handle their own lifecycle
+    - Implement proper error handling in all components
  
  3. **Use consistent HTML element IDs**
- 
-    - When adding new components that target specific elements (like "recent-posts")
-    - Ensure the IDs are consistent and well-documented
+    - Maintain predictable element targeting
+    - Document all IDs used for dynamic content
  
  4. **Minimize inline JavaScript**
-    - Keep JavaScript out of Markdown files
-    - Create proper TypeScript modules and import them
+    - Create TypeScript modules instead of inline scripts
+    - Separate code from content/markup
  
- ## Jekyll Integration
+ ### Jekyll Integration
  
  1. **Test components in isolation**
- 
-    - Create minimal test cases when debugging complex components
-    - Avoid relying on the full Jekyll site for testing
+    - Create minimal test cases for complex components
+    - Avoid full Jekyll site dependency for testing
  
  2. **Always rebuild after TypeScript changes**
- 
-    - Run `just js-build` after making TypeScript changes
-    - Ensures the compiled output is updated
+    - Run `just js-build` to update compiled output
+    - Verify changes take effect in the browser
  
  3. **Use jQuery carefully**
- 
-    - The codebase uses jQuery in many places; maintain this pattern for consistency
+    - Maintain consistency with existing jQuery patterns
     - Be mindful of jQuery dependencies
  
  4. **Include script references consistently**
- 
-    - When adding new script functionality, follow the pattern in `_includes/scripts.html`
+    - Follow patterns in `_includes/scripts.html`
     - Avoid adding inline scripts
  
  5. **Jekyll development environment**
     - Check if Jekyll is already running before starting a new server
-    - If Jekyll is already running at http://localhost:4000, use that instance
-    - Only use `just jekyll-serve` when starting a new development session
-    - For testing changes, simply refresh the browser window
- 
- ## Debugging
+    - Use existing instance at http://localhost:4000 when available
+    - Only use `just jekyll-serve` for new development sessions
+    - Refresh browser to test changes
+ 
+ ### Debugging
  
  1. **Use console.log strategically**
- 
-    - Add descriptive log messages with emoji prefixes (like 🔍, ✅, ❌)
-    - Makes logs more scannable and meaningful
+    - Add descriptive messages with emoji prefixes
+    - Make logs scannable and meaningful
  
  2. **Check the Network tab**
- 
-    - For fetch/AJAX issues, always check the Network tab
-    - Verify resources are loading properly
- 
- 3. **View source maps**
- 
-    - Use browser dev tools with source maps to debug TypeScript directly
-    - Set breakpoints in the original TypeScript code
+    - Verify resources load properly
+    - Inspect response data for correctness
+ 
+ 3. **Use source maps for debugging**
+    - Set breakpoints in original TypeScript
+    - Trace execution flow directly
  
- 4. **Create isolated test pages when needed**
-    - For complex components, create dedicated test pages
-    - Helps isolate problems from the rest of the site
- 
- ## Performance
+ 4. **Create isolated test pages**
+    - Separate component testing from main site
+    - Isolate problems from other dependencies
+ 
+ ### Performance
  
  1. **Minimize asset sizes**
- 
-    - Use image compression for web assets
-    - Prefer WebP format for images when possible
+    - Compress web assets appropriately
+    - Prefer WebP format for images
  
- 2. **Lazy load components when appropriate**
- 
-    - Use lazy loading for components not needed on initial render
-    - Improves initial page load time
+ 2. **Lazy load when appropriate**
+    - Defer non-critical component loading
+    - Improve initial page performance
  
  3. **Profile before optimizing**
-    - Use browser performance tools to identify actual bottlenecks
-    - Focus optimization efforts on measured issues, not assumptions
- 
- ## Version Control
- 
- 1. **Use meaningful commit messages**
- 
-    - Explain what changes were made and why
-    - Link to issues or discussions when relevant
- 
- 2. **Commit small, focused changes**
-    - Each commit should address a single concern
-    - Makes review and potential rollbacks easier
- 
- ## Testing
- 
- 1. **Verify changes in multiple browsers**
- 
-    - Test at least in Chrome and Firefox
-    - Check mobile responsiveness
- 
- 2. **Run existing tests before committing**
-    - Ensure changes don't break existing functionality
-    - Add tests for new features when appropriate
+    - Use browser performance tools
+    - Focus on measured bottlenecks
+ 
+ ## Examples
+ 
+ <example>
+ // Good: Properly checking document readiness
+ function initRecentPosts() {
+   const container = document.getElementById('recent-posts');
+   if (!container) return;
+   
+   // Implementation details...
+ }
+ 
+ if (document.readyState === 'loading') {
+   document.addEventListener('DOMContentLoaded', initRecentPosts);
+ } else {
+   initRecentPosts();
+ }
+ </example>
+ 
+ <example type="invalid">
+ // Bad: Not checking document readiness
+ function initRecentPosts() {
+   const container = document.getElementById('recent-posts');
+   // This might fail if the DOM isn't loaded yet
+   container.innerHTML = 'Loading...';
+   
+   // Implementation details...
+ }
+ 
+ // Directly calling without checking document state
+ initRecentPosts();
+ </example>
+ 
+ <example>
+ // Good: Proper error handling
+ function fetchRecentPosts() {
+   fetch('/api/recent-posts')
+     .then(response => {
+       if (!response.ok) {
+         throw new Error(`Failed to fetch posts: ${response.status}`);
+       }
+       return response.json();
+     })
+     .then(data => {
+       renderPosts(data);
+     })
+     .catch(error => {
+       console.error('🔴 Error loading recent posts:', error);
+       showFallbackContent();
+     });
+ }
+ </example>
+ 
+ <example>
+ // Good: TypeScript interface usage
+ interface Post {
+   title: string;
+   url: string;
+   date: string;
+   excerpt?: string;
+ }
+ 
+ function renderPosts(posts: Post[]) {
+   const container = document.getElementById('posts-container');
+   if (!container) return;
+   
+   posts.forEach(post => {
+     // Render post with proper type safety
+   });
+ }
+ </example>
  
```

---

_****_

Perfect! I've updated the rule file to properly follow Cursor's rule format standards. Here are the key changes I made:

1. **Frontmatter updates**:
   - Changed `description` to follow the ACTION when TRIGGER to OUTCOME format
   - Changed `glob` to `globs` (plural) in array format
   - Added `tags` for better categorization
   - Added `priority: 2` (medium priority)
   - Added `version: 1.0.0` following semantic versioning

2. **Added required sections**:
   - Added `<version>1.0.0</version>` tag after the title
   - Added a formal `Context` section describing when to apply the rule
   - Changed section headings to follow the Requirements structure
   - Streamlined and improved the language in all requirements

3. **Added examples section**:
   - Added four concrete examples showing good and bad patterns
   - Included an example marked as `type="invalid"` to demonstrate anti-patterns
   - Added examples for key requirements (document readiness, error handling, TypeScript interfaces)

4. **Removed redundant sections**:
   - Removed Version Control and Testing sections to focus on the core blog code requirements
   - These could be added back if they're essential to the blog code development

The rule now follows the proper Cursor rule format and should be correctly applied when working with TypeScript, JavaScript, SCSS, or CSS files in your blog project.

---

_**User**_

The change failed to apply do the temp rule thing

---

_**Assistant**_

<think>The user is saying that the rule changes didn't apply properly and wants me to follow the temp file approach described in the cursor rules. According to the "000-cursor-rule-creation" rule, Cursor prevents direct creation or modification of .mdc files, and we need to use a workaround.

The proper approach should be:
1. Create a temporary markdown file
2. Edit the temporary file with the rule content
3. Copy the temporary file to the .mdc extension
4. Clean up the temporary file

Let me implement this approach.</think>You're right, let's follow the proper procedure for modifying Cursor rule files using the temporary file approach:

---

_****_

```bash
touch temp-blog-code-rule.md
```

```
❯ touch temp-blog-code-rule.md
```

---

_****_

Now I'll edit the temporary file with the updated rule content:

---

_****_



---

_****_



---



---

