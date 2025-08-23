// Hardcoded featured posts list based on tags and content quality
// This replaces the search-driven approach for better performance and control

export interface FeaturedPost {
    url: string;
    title: string;
    description: string;
    reason: string; // Why this post is featured
}

// Data-driven featured posts list based on:
// 1. Posts with "featured: true" in frontmatter
// 2. Posts with "search-featured" tag
// 3. High-quality posts representing key blog themes
export const FEATURED_POSTS: FeaturedPost[] = [
    {
        url: "/eulogy",
        title: "Igor's Eulogy",
        description: "How I want to live - a personal manifesto covering values, health, relationships, and career philosophy",
        reason: "Core manifesto post with 'featured: true' and 'search-featured' tags"
    },
    {
        url: "/sustainable-work",
        title: "I don't want to die knowing I spent too much time at work",
        description: "Work-life balance manifesto with practical advice for sustainable careers and team culture",
        reason: "Has 'featured: true' tag, covers key management/health themes"
    },
    {
        url: "/manager-book",
        title: "How to EM: Be the manager everyone wants",
        description: "Comprehensive guide to engineering management covering behaviors, practices, and continuous improvement",
        reason: "Has 'search-featured' tag, comprehensive management resource"
    },
    {
        url: "/the-recruiter-does-not-think-you-are-hot",
        title: "The recruiter does not think you're hot",
        description: "Career lesson story about making decisions for the right reasons, not distractions",
        reason: "Has 'featured: true' tag, engaging career advice story"
    },
    {
        url: "/7-habits",
        title: "The 7 habits: A Manual for life",
        description: "Deep dive into Stephen Covey's transformative habits for personal and professional effectiveness",
        reason: "High-quality content with 'emotional intelligence' and 'how igor ticks' tags"
    },
    {
        url: "/being-a-great-manager",
        title: "Being a Great Manager",
        description: "Management principles and practices from a software engineering perspective",
        reason: "Key management content with 'manager' and 'how igor ticks' tags"
    }
];

/**
 * Get the hardcoded featured posts
 * This replaces the previous Algolia search-based approach
 */
export function getFeaturedPosts(): FeaturedPost[] {
    return FEATURED_POSTS;
}

/**
 * Get a limited number of featured posts
 */
export function getFeaturedPostsLimit(limit: number): FeaturedPost[] {
    return FEATURED_POSTS.slice(0, limit);
}