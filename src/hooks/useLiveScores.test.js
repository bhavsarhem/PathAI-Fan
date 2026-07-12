import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLiveScores } from './useLiveScores';

describe('useLiveScores Hook', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should return loading state initially and then success data', async () => {
    const mockData = {
      events: [
        {
          id: '12345',
          name: 'Spain vs France',
          date: '2026-07-14T19:00Z',
          status: {
            type: {
              state: 'in',
              shortDetail: "75'"
            }
          },
          competitions: [
            {
              competitors: [
                { homeAway: 'home', team: { displayName: 'Spain', logo: 'spain.png' }, score: '2' },
                { homeAway: 'away', team: { displayName: 'France', logo: 'france.png' }, score: '1' }
              ]
            }
          ]
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const { result } = renderHook(() => useLiveScores());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.liveMatches).toHaveLength(1);
    expect(result.current.featuredMatch.home.name).toBe('Spain');
    expect(result.current.featuredMatch.away.name).toBe('France');
    expect(result.current.featuredMatch.home.score).toBe('2');
  });

  it('should handle fetch failure and return error state', async () => {
    fetch.mockRejectedValueOnce(new Error('Network failure'));

    const { result } = renderHook(() => useLiveScores());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network failure');
  });
});
