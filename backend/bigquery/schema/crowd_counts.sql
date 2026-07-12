-- crowd_counts table
CREATE TABLE IF NOT EXISTS `{PROJECT}.pathai_fifa2026.crowd_counts` (
  snapshot_id     STRING NOT NULL,
  zone            STRING NOT NULL,
  current_count   INT64 NOT NULL,
  capacity        INT64 NOT NULL,
  occupancy_pct   FLOAT64,
  timestamp       TIMESTAMP NOT NULL
)
PARTITION BY DATE(timestamp)
OPTIONS (description = 'Crowd count snapshots per zone (5s polling)');

-- fan_tickets (anonymized)
CREATE TABLE IF NOT EXISTS `{PROJECT}.pathai_fifa2026.fan_tickets` (
  ticket_id       STRING NOT NULL,
  zone            STRING NOT NULL,
  gate            STRING,
  match_id        STRING,
  booking_date    DATE
)
OPTIONS (description = 'Anonymized fan ticket data for zone-level analytics');

-- staff_activity
CREATE TABLE IF NOT EXISTS `{PROJECT}.pathai_fifa2026.staff_activity` (
  activity_id     STRING NOT NULL,
  staff_id        STRING NOT NULL,
  role            STRING NOT NULL,
  action          STRING NOT NULL,
  incident_id     STRING,
  zone            STRING,
  timestamp       TIMESTAMP NOT NULL
)
PARTITION BY DATE(timestamp)
OPTIONS (description = 'Staff incident claim/resolve activity log');
