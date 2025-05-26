# Product Requirements Document (PRD) for Header Copy Link Feature

## Status: Complete

## 1. Introduction

This PRD outlines the implementation of a "Copy Link" feature for headers in blog posts on idvorkin.github.io. The feature enables users to easily share direct links to specific sections of blog posts by providing a clickable icon next to headers that copies the properly formatted URL to their clipboard.

The system addresses the current friction where users must manually copy URLs and add header anchors, while also handling domain remapping requirements between development and production environments.

**Target Users:**

- Blog readers who want to share specific sections
- Content creators referencing specific parts of posts
- Users accessing the blog from different environments (localhost, idvork.in, production)

**Business Context:**

- Improves user experience and content shareability
- Reduces friction in content referencing
- Standardizes URL format across environments

## 2. Goals

### Primary Objectives

- Implement intuitive header link copying functionality
- Automate domain remapping for consistent URL format
- Provide seamless user experience with visual feedback
- Ensure cross-browser compatibility

### Success Criteria

- Copy link icons appear on all headers (h1-h6) within content areas
- URLs are correctly transformed and copied to clipboard
- Feature works across modern browsers with graceful fallbacks
- Visual feedback confirms successful copy operations

### Key Performance Indicators (KPIs)

- Feature activation rate (headers with copy functionality)
- Successful copy operations vs. attempts
- Cross-browser compatibility coverage
- User engagement with shared section links

## 3. Features and Requirements

### Functional Requirements

- **Header Detection**: Automatically identify all headers (h1-h6) in main content areas only
- **Content Area Scoping**: Exclude sidebar, navigation, and other non-content areas from anchor generation
- **Icon Display**: Show copy link icon on header hover within content areas only
- **URL Generation**: Create proper anchor links for each header in content
- **Domain Remapping**: Transform URLs according to environment rules
- **Clipboard Integration**: Copy transformed URLs to user clipboard
- **Visual Feedback**: Display "Copied!" confirmation tooltip

### Non-Functional Requirements

- **Performance**: Icon appearance < 100ms on hover
- **Compatibility**: Support modern browsers with fallback for older versions
- **Accessibility**: Maintain keyboard navigation and screen reader compatibility
- **Reliability**: 99%+ success rate for copy operations

### User Experience Requirements

- Subtle, non-intrusive icon design
- Smooth hover transitions and animations
- Clear visual feedback for successful operations
- Consistent behavior across all headers

### Integration Requirements

- Seamless integration with existing Jekyll blog infrastructure
- Compatibility with current CSS and JavaScript frameworks
- No interference with existing header functionality

### Technical Requirements

- TypeScript implementation for type safety
- Comprehensive unit test coverage
- CSS-in-JS for dynamic styling
- Fallback mechanisms for clipboard API limitations

## 4. Epic Structure

**Epic-1: Core Copy Link Functionality (Complete)**

- Implement basic header copy link feature with icon display, URL transformation, and clipboard integration

**Epic-2: Enhanced User Experience (Future)**

- Advanced styling options, customizable icon sets, and improved accessibility features

**Epic-3: Analytics and Optimization (Future)**

- Usage tracking, performance monitoring, and user behavior analysis

## 5. Story List

### Epic-1: Core Copy Link Functionality (Complete)

**Story-1: Project Setup and Module Structure**

- Create TypeScript module for header copy link functionality
- Set up proper exports and integration points
- Define configuration interfaces and default options

**Story-2: Header Detection and ID Generation**

- Implement automatic header discovery in main content areas only (exclude sidebar, navigation)
- Generate unique IDs for headers without existing anchors
- Handle special characters and ensure ID uniqueness
- Add content area filtering to prevent sidebar headers from getting anchors

**Story-3: Copy Link Icon Implementation**

- Create and style copy link icons for headers
- Implement hover effects and positioning
- Add CSS injection for dynamic styling

**Story-4: URL Transformation Logic**

- Implement domain remapping rules (localhost → production, idvork.in → azurewebsites.net)
- Convert hash-based anchors to path-based format
- Handle edge cases and URL validation

**Story-5: Clipboard Integration**

- Implement modern Clipboard API for copying URLs
- Add fallback mechanism using document.execCommand
- Provide error handling and user feedback

**Story-6: Visual Feedback System**

- Create "Copied!" tooltip with proper positioning
- Implement fade-in/fade-out animations
- Ensure tooltip doesn't interfere with page layout

**Story-7: Testing and Quality Assurance**

- Develop comprehensive unit test suite
- Test URL transformation logic across scenarios
- Verify clipboard functionality and fallbacks
- Validate cross-browser compatibility
- Test content area scoping to ensure sidebar headers are excluded
- Add regression tests for sidebar anchor prevention

**Story-8: Integration and Deployment**

- Integrate with main.ts initialization system
- Add feature to global page loading sequence
- Deploy and verify functionality in production

## 6. Future Enhancements

### Epic-2: Enhanced User Experience

- **Customizable Icons**: Allow different icon styles and themes
- **Keyboard Shortcuts**: Add keyboard navigation for copy functionality
- **Accessibility Improvements**: Enhanced screen reader support and ARIA labels
- **Mobile Optimization**: Touch-friendly interactions for mobile devices
- **Advanced Content Filtering**: Configurable exclusion rules for different page layouts

### Epic-3: Analytics and Optimization

- **Usage Tracking**: Monitor copy link usage patterns
- **Performance Metrics**: Track feature performance and optimization opportunities
- **A/B Testing**: Test different icon styles and positioning
- **User Feedback**: Collect user preferences and improvement suggestions

### Additional Considerations

- **Internationalization**: Support for multiple languages in tooltips
- **Theme Integration**: Adapt icon styling to different blog themes
- **Social Media Integration**: Direct sharing to social platforms
- **Advanced URL Customization**: User-configurable URL transformation rules

## 7. Technical Implementation Notes

### Architecture Decisions

- **Modular Design**: Separate module for maintainability and testing
- **Progressive Enhancement**: Feature works without breaking existing functionality
- **Graceful Degradation**: Fallbacks ensure functionality across browser versions

### Content Area Scoping Strategy

- **Primary Target**: `#content-holder` or main content container
- **Exclusion Rules**: Explicitly exclude sidebar, navigation, footer, and other non-content areas
- **Selector Strategy**: Use specific CSS selectors to target only main content headers
- **Fallback Logic**: If primary container not found, use document.body with exclusion filters

### Security Considerations

- **XSS Prevention**: Proper sanitization of generated IDs and URLs
- **Content Security Policy**: Compliance with existing CSP rules
- **Safe URL Generation**: Validation of transformed URLs

### Performance Optimizations

- **Lazy Loading**: Initialize feature only when needed
- **Event Delegation**: Efficient event handling for multiple headers
- **CSS Optimization**: Minimal style injection and efficient selectors

### Development Inner Loop Practices

- **Clean Commits**: Stage specific files, review changes before committing
- **Unit Testing**: Add tests for bugs found, ensure they pass (red-to-green approach)
- **DRY Principle**: Avoid code duplication in header detection and styling logic
- **Type Safety**: Use TypeScript const assertions and strict typing
- **Minimal Nesting**: Keep scope nesting shallow for better readability

---

_This PRD serves as the definitive specification for the Header Copy Link Feature implementation, ensuring consistent development approach and clear success criteria._ 🔗
