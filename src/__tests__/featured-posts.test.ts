import { describe, it, expect } from 'vitest';
import { getFeaturedPosts, getFeaturedPostsLimit, FEATURED_POSTS, type FeaturedPost } from '../featured-posts';

describe('Featured Posts', () => {
    it('should return all featured posts', () => {
        const posts = getFeaturedPosts();
        expect(posts).toBeDefined();
        expect(Array.isArray(posts)).toBe(true);
        expect(posts.length).toBeGreaterThan(0);
        
        // Check structure of first post
        const firstPost = posts[0];
        expect(firstPost).toHaveProperty('url');
        expect(firstPost).toHaveProperty('title');
        expect(firstPost).toHaveProperty('description');
        expect(firstPost).toHaveProperty('reason');
        
        // Check data types
        expect(typeof firstPost.url).toBe('string');
        expect(typeof firstPost.title).toBe('string');
        expect(typeof firstPost.description).toBe('string');
        expect(typeof firstPost.reason).toBe('string');
    });

    it('should limit posts when requested', () => {
        const limit = 3;
        const posts = getFeaturedPostsLimit(limit);
        expect(posts.length).toBe(limit);
    });

    it('should contain Igor\'s Eulogy as the first post', () => {
        const posts = getFeaturedPosts();
        expect(posts[0].url).toBe('/eulogy');
        expect(posts[0].title).toBe('Igor\'s Eulogy');
    });

    it('should have 6 featured posts total', () => {
        const posts = getFeaturedPosts();
        expect(posts.length).toBe(6);
    });

    it('should have correct post URLs', () => {
        const posts = getFeaturedPosts();
        const expectedUrls = [
            '/eulogy',
            '/sustainable-work',
            '/manager-book',
            '/the-recruiter-does-not-think-you-are-hot',
            '/7-habits',
            '/being-a-great-manager'
        ];
        
        posts.forEach((post, index) => {
            expect(post.url).toBe(expectedUrls[index]);
        });
    });

    it('should have reasons for each featured post', () => {
        const posts = getFeaturedPosts();
        posts.forEach(post => {
            expect(post.reason).toBeTruthy();
            expect(post.reason.length).toBeGreaterThan(0);
        });
    });
});