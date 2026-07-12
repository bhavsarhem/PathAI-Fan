import { describe, it, expect } from 'vitest';
import { queryVectorDB } from './vectorStore';

describe('Vector DB Storage Search', () => {
  it('should return context on prohibited items', () => {
    const result = queryVectorDB('What items are prohibited?');
    expect(result).toContain('Prohibited items at FIFA Arena 26 include');
  });

  it('should return context on washrooms', () => {
    const result = queryVectorDB('Where is the washroom?');
    expect(result).toContain('Washrooms are located at every corner');
  });

  it('should return default message if no matches found', () => {
    const result = queryVectorDB('xyzabcunknownword');
    expect(result).toBe('No specific stadium context found for this query.');
  });
});
