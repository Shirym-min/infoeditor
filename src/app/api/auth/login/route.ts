import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json(
      { error: "email and password required" },
      { status: 400 },
    );
  }

  const result = await sql`
    SELECT id, password_hash
    FROM users
    WHERE email = ${email}
  `;

  if (result.rowCount === 0) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const user = result.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);

  if (!ok) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7日後

  await sql`
  INSERT INTO sessions (id, user_id, expires_at)
  VALUES (${sessionId}, ${user.id}, ${expiresAt.toISOString()})
`;

  const cookieStore = await cookies();
  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    path: "/",
  });

  return Response.json({ ok: true });
}
