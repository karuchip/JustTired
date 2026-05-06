import { sql } from "@/src/neon/neon";

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);

  // 初期化用（現在の最大IDだけ返す）
  const mode = searchParams.get('mode')
  if (mode === 'init') {
    const result = await sql `
      SELECT MAX(id) as max_id FROM tired_posts`
    ;
    return Response.json(result[0]);
  }

  // 匿名ID取得
  const anonymousId = searchParams.get('anonymousId');
  if(!anonymousId) {
    return Response.json({error: "anonymousId is required"}, {status: 400})
  }

  // 差分取得処理
  const raw = searchParams.get('lastId')
  const lastId = Number(raw);
  const safeId = isNaN(lastId) ? 0 : lastId;

  const result = await sql `
    SELECT * FROM tired_posts
    WHERE id > ${safeId}
    AND anonymous_id <> ${anonymousId}
    ORDER BY created_at ASC
  `;
  return Response.json(result);
}

export async function POST(req:Request) {
  const {text, anonymousId} = await req.json();

  if(typeof text !== "string") {
    return Response.json({error: "invalid"}, {status: 400});
  }

  await sql`
  INSERT INTO tired_posts (text, anonymous_id)
  VALUES (${text}, ${anonymousId})
  `;

  return Response.json({ok: true});
}
