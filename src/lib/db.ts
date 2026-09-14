export interface DbClientConfig {
  databaseUrl: string | undefined;
  isConfigured: boolean;
}

export const getDbConfig = (): DbClientConfig => {
  const databaseUrl =
    (typeof process !== 'undefined' && process.env?.DATABASE_URL) ||
    import.meta.env.VITE_DATABASE_URL ||
    (import.meta.env as Record<string, string>).DATABASE_URL;

  return {
    databaseUrl,
    isConfigured: Boolean(databaseUrl),
  };
};


