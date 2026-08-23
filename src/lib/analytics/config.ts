/**
 * The day boundary for every analytics metric.
 *
 * Two things depend on this and must agree: when the visitor-id salt rotates
 * (visitor.ts), and which day an event is bucketed into (the `day` column in
 * the SQL migration). If they drift, one person's visits split across two
 * visitor ids within a single reported day and unique counts inflate.
 *
 * The migration lives in the separate, private stats-portfolio repo, so
 * changing this means changing the timezone literal there too.
 */
export const SITE_TIMEZONE = "America/New_York";
