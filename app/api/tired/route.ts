import { sql } from "@/src/neon/neon";

export async function GET() {
  const result = await sql `SELECT * FROM tired_posts ORDER BY created_at DESC LIMIT 50`;
  return Response.json(result);
}

export async function POST(req:Request) {
  const {text} = await req.json();

  if(typeof text !== "string") {
    return Response.json({error: "invalid"}, {status: 400});
  }

  await sql`
  INSERT INTO tired_posts (text)
  VALUES (${text})
  `;

  return Response.json({ok: true});
}
