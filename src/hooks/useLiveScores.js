import { useState, useEffect } from 'react';

const ESPN_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';

export function useLiveScores() {
  const [data, setData] = useState({
    liveMatches: [],
    upcomingMatches: [],
    pastMatches: [],
    featuredMatch: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScores = async () => {
    try {
      const response = await fetch(ESPN_URL);
      if (!response.ok) throw new Error('Failed to fetch data');
      const json = await response.json();
      
      const events = json.events || [];
      
      const live = [];
      const upcoming = [];
      const past = [];

      let featured = null;

      events.forEach(event => {
        const status = event.status.type.state; // 'pre', 'in', 'post'
        const homeTeam = event.competitions[0].competitors.find(c => c.homeAway === 'home');
        const awayTeam = event.competitions[0].competitors.find(c => c.homeAway === 'away');
        
        // Parse highlights/goals (if available in the API response under details or notes)
        const highlights = [];
        if (event.competitions[0].details) {
          event.competitions[0].details.forEach(detail => {
            if (detail.scoringPlay) {
              const scorer = detail.participants?.[0]?.athlete?.displayName || 'Goal';
              highlights.push({ description: `${scorer} (${detail.clock.displayClock}')`, teamId: detail.team.id });
            }
          });
        }

        const matchObj = {
          id: event.id,
          name: event.name,
          date: new Date(event.date).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          statusState: status, // 'pre', 'in', 'post'
          statusDetail: event.status.type.shortDetail, // e.g., "75'", "FT", "3:00 PM"
          home: {
            name: homeTeam?.team?.displayName || 'TBD',
            score: homeTeam?.score || '0',
            logo: homeTeam?.team?.logo || null,
          },
          away: {
            name: awayTeam?.team?.displayName || 'TBD',
            score: awayTeam?.score || '0',
            logo: awayTeam?.team?.logo || null,
          },
          highlights: highlights
        };

        if (status === 'in') {
          live.push(matchObj);
          if (!featured) featured = matchObj;
        } else if (status === 'pre') {
          upcoming.push(matchObj);
        } else {
          past.push(matchObj);
        }
      });

      // If no live match is featured, pick the most recent past or next upcoming
      if (!featured) {
        if (upcoming.length > 0) featured = upcoming[0];
        else if (past.length > 0) featured = past[past.length - 1];
      }

      setData({
        liveMatches: live,
        upcomingMatches: upcoming,
        pastMatches: past.reverse(), // most recent first
        featuredMatch: featured
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    // Poll every 30 seconds
    const interval = setInterval(fetchScores, 30000);
    return () => clearInterval(interval);
  }, []);

  return { ...data, loading, error };
}
