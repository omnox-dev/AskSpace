export interface DbClientConfig {
  databaseUrl: string | undefined;
  isConfigured: boolean;
  host?: string;
  password?: string;
}

export const getDbConfig = (): DbClientConfig => {
  const databaseUrl =
    import.meta.env.VITE_DATABASE_URL ||
    (typeof process !== 'undefined' && process.env?.DATABASE_URL) ||
    (import.meta.env as Record<string, string>).DATABASE_URL;

  if (!databaseUrl) {
    return { databaseUrl: undefined, isConfigured: false };
  }

  try {
    const match = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)/);
    if (match) {
      const password = match[2];
      let host = match[3];
      const httpHost = host.replace('-pooler', '');
      return {
        databaseUrl,
        isConfigured: true,
        host: httpHost,
        password,
      };
    }
  } catch (err) {
    console.warn('Failed to parse DATABASE_URL:', err);
  }

  return { databaseUrl, isConfigured: Boolean(databaseUrl) };
};

export const queryNeonSql = async <T = any>(query: string, params: any[] = []): Promise<T[] | null> => {
  const config = getDbConfig();
  if (!config.isConfigured || !config.host || !config.password) {
    return null;
  }

  try {
    const res = await fetch(`https://${config.host}/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.password}`,
      },
      body: JSON.stringify({ query, params }),
    });

    if (!res.ok) {
      console.warn('Neon HTTP query returned non-200:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return (data.rows || []) as T[];
  } catch (err) {
    console.error('Error querying Neon database over HTTP:', err);
    return null;
  }
};



