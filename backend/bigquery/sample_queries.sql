-- 1. Incidents by zone (last 24h)
SELECT zone, type, COUNT(*) AS incident_count
FROM `{PROJECT}.pathai_fifa2026.incidents`
WHERE DATE(timestamp) = CURRENT_DATE()
GROUP BY zone, type
ORDER BY incident_count DESC;

-- 2. Average SOS response time by type
SELECT type, AVG(response_time_seconds) AS avg_response_seconds
FROM `{PROJECT}.pathai_fifa2026.incidents`
WHERE status = 'resolved'
GROUP BY type;

-- 3. Peak crowd times per zone
SELECT zone, TIMESTAMP_TRUNC(timestamp, MINUTE) AS minute, AVG(current_count) AS avg_crowd
FROM `{PROJECT}.pathai_fifa2026.crowd_counts`
GROUP BY zone, minute
ORDER BY zone, minute;

-- 4. Staff incident resolution rate
SELECT staff_id, role,
  COUNTIF(action = 'claimed') AS claimed,
  COUNTIF(action = 'resolved') AS resolved
FROM `{PROJECT}.pathai_fifa2026.staff_activity`
GROUP BY staff_id, role;

-- 5. Zones over 85% capacity (risk alerts)
SELECT zone, snapshot_id, occupancy_pct, timestamp
FROM `{PROJECT}.pathai_fifa2026.crowd_counts`
WHERE occupancy_pct > 0.85
ORDER BY timestamp DESC
LIMIT 100;
