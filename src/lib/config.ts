import { sql } from "@/lib/db";

export type AppConfig = {
  data: unknown;
  updatedAt: string | null;
};

export async function getConfig(): Promise<AppConfig> {
  const result = await sql`
    SELECT data, updated_at
    FROM app_config
    WHERE id = 1
  `;

  if (result.rowCount === 0) {
    return { data: {}, updatedAt: null };
  }

  return {
    data: result.rows[0].data,
    updatedAt: result.rows[0].updated_at
      ? new Date(result.rows[0].updated_at).toISOString()
      : null,
  };
}

export async function setConfig(data: unknown): Promise<AppConfig> {
  const result = await sql`
    INSERT INTO app_config (id, data)
    VALUES (1, ${JSON.stringify(data)}::jsonb)
    ON CONFLICT (id)
    DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    RETURNING data, updated_at
  `;

  return {
    data: result.rows[0].data,
    updatedAt: result.rows[0].updated_at
      ? new Date(result.rows[0].updated_at).toISOString()
      : null,
  };
}
