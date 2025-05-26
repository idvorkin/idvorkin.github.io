# Product Requirements Document (PRD) for Sunburst Interactive Prompts

## Status: Draft

## 1. Introduction

The Sunburst Interactive Prompts system is a dynamic visualization and content discovery feature for Igor's personal blog. It transforms hierarchical content (like "Things I Enjoy" and "7 Habits") into interactive sunburst charts that provide contextual prompts and suggestions to users.

The system currently exists in a functional state but requires documentation, testing improvements, and potential enhancements to maximize user engagement and content discoverability.

**Target Users:**

- Blog visitors seeking inspiration and ideas
- Igor himself for personal reflection and goal-setting
- Readers interested in interactive content exploration

**Business Context:**

- Enhances user engagement on personal blog pages
- Provides unique interactive experience differentiating from static content
- Supports personal development and reflection workflows

## 2. Goals

### Primary Objectives

- **Content Discovery**: Enable users to explore hierarchical content through intuitive visual interaction
- **Engagement**: Increase time spent on blog pages through interactive elements
- **Personalization**: Provide contextual, randomized prompts based on user selections
- **Accessibility**: Ensure functionality works across devices and browsers

### Success Criteria

- Sunburst visualizations load successfully on all target pages
- Click interactions generate appropriate contextual prompts
- Random prompt generation provides diverse, relevant suggestions
- Zero JavaScript errors during normal operation
- Responsive design works on mobile and desktop

### Key Performance Indicators (KPIs)

- Page load time < 3 seconds for sunburst initialization
- Click-to-prompt response time < 100ms
- Zero console errors during user interactions
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

## 3. Features and Requirements

### Functional Requirements

- **Sunburst Visualization**: Interactive circular chart displaying hierarchical content
- **Click Interaction**: Respond to clicks on sunburst segments and center text
- **Prompt Generation**: Generate contextual prompts based on selected categories
- **Random Selection**: Provide varied prompts from available content pool
- **Content Integration**: Parse markdown content to extract prompts automatically

### Non-Functional Requirements

- **Performance**: Smooth animations and responsive interactions
- **Reliability**: Graceful error handling for missing dependencies
- **Maintainability**: Well-documented, testable code structure
- **Scalability**: Support for multiple sunburst instances on different pages

### User Experience Requirements

- **Visual Feedback**: Clear indication of clickable elements
- **Intuitive Navigation**: Natural interaction patterns for content exploration
- **Content Relevance**: Prompts should match selected categories accurately
- **Accessibility**: Keyboard navigation and screen reader support

### Integration Requirements

- **Plotly.js**: Sunburst chart rendering and interaction handling
- **jQuery**: DOM manipulation and event handling
- **Jekyll**: Integration with static site generation
- **TypeScript**: Type-safe implementation with proper interfaces

### Compliance Requirements

- **Web Standards**: HTML5, CSS3, ES6+ compatibility
- **Performance**: Lighthouse performance score > 90
- **Accessibility**: WCAG 2.1 AA compliance where applicable

## 4. Epic Structure

**Epic-1: Core Sunburst Functionality (Complete)**

- Implement basic sunburst visualization with Plotly.js
- Add click interaction handlers for segments and text
- Integrate with existing blog content structure
- Deploy to production pages

**Epic-2: Enhanced User Experience (Current)**

- Improve visual feedback and interaction clarity
- Add comprehensive error handling and fallbacks
- Implement responsive design optimizations
- Enhance accessibility features

**Epic-3: Content Management (Future)**

- Create admin interface for content management
- Add dynamic content loading capabilities
- Implement content versioning and updates
- Support for multiple content sources

**Epic-4: Analytics and Insights (Future)**

- Track user interaction patterns
- Generate usage analytics and reports
- A/B testing framework for different layouts
- Performance monitoring and optimization

## 5. Story List

### Epic-1: Core Sunburst Functionality (Complete)

- **Story-1**: ✅ Set up Plotly.js integration and basic sunburst rendering
- **Story-2**: ✅ Implement TreeNode class and hierarchical data structure
- **Story-3**: ✅ Add click event handlers for sunburst segments
- **Story-4**: ✅ Create prompt generation system from markdown content
- **Story-5**: ✅ Integrate with Jekyll blog pages (enjoy2.md, 7-habits.md)
- **Story-6**: ✅ Deploy to production with basic functionality

### Epic-2: Enhanced User Experience (Current)

- **Story-7**: Add visual hover effects and click feedback
- **Story-8**: Implement comprehensive error handling for missing dependencies
- **Story-9**: Create responsive design for mobile devices
- **Story-10**: Add keyboard navigation support
- **Story-11**: Improve prompt text formatting and display
- **Story-12**: Add loading states and progress indicators

### Epic-3: Content Management (Future)

- **Story-13**: Create content schema validation
- **Story-14**: Implement dynamic content loading from external sources
- **Story-15**: Add content versioning and update mechanisms
- **Story-16**: Create admin interface for content editing
- **Story-17**: Support for multiple content formats (JSON, YAML, Markdown)
- **Story-18**: Implement content caching and optimization

### Epic-4: Analytics and Insights (Future)

- **Story-19**: Implement user interaction tracking
- **Story-20**: Create analytics dashboard
- **Story-21**: Add A/B testing framework
- **Story-22**: Performance monitoring and alerting
- **Story-23**: User behavior analysis and reporting
- **Story-24**: Optimization recommendations system

## 6. Future Enhancements

### Advanced Interaction Features

- **Multi-level Navigation**: Support for deeper hierarchical exploration
- **Search Integration**: Find specific prompts or categories quickly
- **Bookmarking**: Save favorite prompts for later reference
- **Social Sharing**: Share interesting prompts on social media

### Content Intelligence

- **AI-Generated Prompts**: Use LLM to generate contextual suggestions
- **Personalization**: Learn user preferences and suggest relevant content
- **Content Recommendations**: Suggest related categories based on interactions
- **Seasonal Content**: Time-based prompt variations and themes

### Platform Integration

- **Mobile App**: Native mobile application with sunburst functionality
- **API Development**: RESTful API for third-party integrations
- **Widget System**: Embeddable sunburst widgets for other websites
- **Plugin Architecture**: Extensible system for custom functionality

### Advanced Analytics

- **Heat Mapping**: Visual representation of most-clicked areas
- **User Journey Analysis**: Track paths through content hierarchy
- **Conversion Tracking**: Measure engagement to action conversion
- **Predictive Analytics**: Forecast user behavior and content needs

## 7. Technical Architecture

### Current Implementation

```typescript
// Core components
- TreeNode: Hierarchical data structure
- add_sunburst(): Main visualization function
- random_prompt_for_label(): Prompt generation logic
- category_to_prompts(): Content parsing system
```

### Dependencies

- **Plotly.js 2.6.3**: Sunburst chart rendering
- **jQuery**: DOM manipulation and events
- **TypeScript**: Type-safe development
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing

### File Structure

```
src/
├── random-prompter.ts    # Core sunburst functionality
├── page-loader.ts        # Page-specific loading logic
└── index.ts             # Main exports and utilities

tests/
├── unit/random-prompter.test.ts    # Unit tests
└── e2e/todo-enjoy.spec.ts          # E2E tests
```

## 8. Current Status & Issues

### What's Working ✅

- Sunburst visualization renders correctly using Plotly.js
- Data structure (ThingsIEnjoy tree) loads properly
- Visual hierarchy displays categories and subcategories
- Page loads without JavaScript errors
- Module loading system works (`defer` function executes)
- `load_enjoy2` function is called successfully
- `add_sunburst` function executes without errors
- DOM elements exist (`#sunburst` and `#sunburst_text`)

### Critical Issues Identified ❌

- **Plotly event handlers not attached**: `plotly_sunburstclick` events don't fire
- **Text div click handler not working**: jQuery click binding fails silently
- **No event handler debugging**: Missing error handling for event attachment failures
- **Silent failures**: Event binding failures don't produce console errors
- Top bar (prompt text) stays at default "Click in any box or circle"
- No visual feedback when clicking on interactive elements

### Technical Root Cause

The `add_sunburst` function in `src/random-prompter.ts` (lines 248-258) attempts to attach two event handlers:

1. jQuery click handler on `#sunburst_text` div (line 248-253)
2. Plotly `plotly_sunburstclick` handler on sunburst chart (line 255-258)

**Both event handlers are failing to attach**, likely due to:

- jQuery event binding compatibility issues
- Plotly event system timing problems
- DOM/Plotly readiness race conditions
- Missing error handling masking actual failures

### Immediate Action Items

1. **Debug event handler attachment**: Add logging to identify why handlers fail
2. **Fix jQuery click binding**: Ensure proper event delegation and timing
3. **Fix Plotly event binding**: Verify Plotly event system compatibility
4. **Add error handling**: Implement proper error reporting for debugging
5. **Update tests**: Ensure E2E tests verify actual click functionality

## 9. Success Metrics

### User Engagement

- Average time spent on sunburst pages
- Number of prompt generations per session
- Return visitor rate for interactive pages
- User feedback and satisfaction scores

### Technical Performance

- Page load time metrics
- JavaScript error rates
- Cross-browser compatibility scores
- Mobile responsiveness metrics

### Content Effectiveness

- Most popular categories and prompts
- Content discovery patterns
- User-generated content engagement
- Prompt relevance and usefulness ratings
