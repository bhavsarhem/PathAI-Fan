-- incidents table
CREATE TABLE IF NOT EXISTS `{PROJECT}.pathai_fifa2026.incidents` (
  incident_id     STRING NOT NULL,
  type            STRING NOT NULL,
  fan_id          STRING,
  seat            STRING,
  zone            STRING,
  status          STRING NOT NULL,
  assigned_staff_id STRING,
  timestamp       TIMESTAMP NOT NULL,
  resolved_at     TIMESTAMP,
  description     STRING,
  response_time_seconds INT64
)
PARTITION BY DATE(timestamp)
OPTIONS (description = 'SOS, women-safety, and missing-person incidents');
