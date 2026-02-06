import { cookies } from "next/headers";
import { sql } from "@/lib/db";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;
  if (!sessionId) return null;

  const result = await sql`
    SELECT users.id, users.email
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = ${sessionId}
      AND sessions.expires_at > now()
  `;

  return result.rowCount ? result.rows[0] : null;
}