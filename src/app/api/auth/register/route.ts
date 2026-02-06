import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json(
      { error: "email and password required" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await sql`
    INSERT INTO users (id, email, password_hash)
    VALUES (${randomUUID()}, ${email}, ${passwordHash})
  `;

  return Response.json({ ok: true });
}