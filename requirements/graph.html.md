# Graph HTML Requirements

## Overview

The graph.html page provides an interactive visualization of blog post connections using the force-graph library. It visually represents the relationship between different pages on the site, showing incoming and outgoing links between them.

### Initialization and Entry Points

The graph can be initialized with a specific node expanded by using URL hash parameters:

- Format: `/graph#pagename` (where "pagename" is the page URL without the leading "/")
- Example: `/graph#eulogy` would open the graph with the "/eulogy" node expanded
- If the specified hash doesn't match any page URL, it defaults to "/eulogy"
- Hash parameter allows deep linking and sharing graph views with specific starting points

## Functional Requirements

1. **Interactive Node Graph**

   - Display posts as nodes in an interactive graph
   - Connect nodes with links based on references between posts
   - Allow expanding/collapsing nodes to show or hide their connections
   - Support zooming and panning within the graph

2. **Node Interaction**

   - Left-click: Toggle expand/collapse of a node's connections
   - Right-click: Open the node's page in a new tab
   - Show node labels with title and expansion indicator (+/- count)

3. **Navigation Controls**

   - Center: Refocus the graph on the currently selected node
   - Open: Open the selected node's page in a new browser tab
   - Collapse: Collapse all nodes except the currently selected one

4. **Node Details**

   - Display detailed information about the selected node
   - Show title, description, and link information in the detail panel
   - Generate HTML content that matches the site's styling

5. **Graph Data Management**
   - Load page link data from back-links.json
   - Filter invalid links
   - Support URL-based node selection (via hash parameters):
     - Extract node identifier from URL hash (window.location.hash)
     - Validate the node exists in the available pages
     - Default to "/eulogy" if the node isn't found
     - Initialize with specified node expanded
   - Dynamically update graph data when nodes are expanded/collapsed
   - Allow direct linking to specific graph states via URL hash

## Technical Requirements

1. **Performance**

   - Efficient rendering of potentially large numbers of nodes
   - Smooth animations for graph transitions
   - Optimized data structure for node and link storage

2. **Compatibility**

   - Support modern browsers (Chrome, Firefox, Safari, Edge)
   - Responsive design for different screen sizes
   - Graceful loading with fallbacks if Force Graph library fails to load

3. **Code Structure**

   - Modular TypeScript implementation
   - Reuse existing link information interfaces (IURLInfo, IURLInfoMap)
   - Clear separation of graph rendering and data handling
   - Proper error handling and debugging support

4. **Testing**
   - End-to-end tests for graph initialization and rendering
   - Unit tests for link utility functions
   - Visual verification via screenshots

## UI/UX Requirements

1. **Layout**

   - Clear separation between graph, controls, and detail sections
   - Responsive sizing of the graph container
   - Consistent styling with the rest of the site

2. **Interaction Feedback**

   - Visual feedback when nodes are selected
   - Smooth animations for graph updates
   - Clear node labels that show expansion state

3. **Error Handling**

   - Graceful loading and fallback mechanisms
   - Clear error indicators if the graph fails to load
   - Console logging for debugging purposes

4. **Accessibility**
   - Keyboard navigation support
   - Proper ARIA attributes for interactive elements
   - Text alternatives for visual elements
