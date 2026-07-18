export const overviewQueryKeys = {
  // Matches everything overview-related — invalidate this to nuke all overview cache
  all: () => ["overview"] as const,

  // The KPI summary aggregates
  summary: () => [...overviewQueryKeys.all(), "summary"] as const,
} as const;
