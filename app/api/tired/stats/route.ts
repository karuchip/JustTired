import { sql } from "@/src/neon/neon";

export async function GET () {
  try {
    const dailyCount = await sql`
      SELECT daily_count
      FROM tired_stats
      WHERE stat_date = CURRENT_DATE
    `;

    const totalCount = await sql`
      SELECT COALESCE(SUM(daily_count), 0) AS total_count
      FROM tired_stats
    `;

    return Response.json({
      daily_count: Number(dailyCount[0]?.daily_count ?? 0),
      total_count : Number(totalCount[0]?.total_count ?? 0)
    });

  }catch (error) {
    console.error(error)

    return Response.json(
      {error: 'server error'},
      {status: 500}
    )
  }
}


export async function POST() {
  try {
    await sql`
    INSERT INTO tired_stats (stat_date, daily_count)
    VALUES(CURRENT_DATE, 1)
    ON CONFLICT (stat_date)
    DO UPDATE
    SET
      daily_count = tired_stats.daily_count + 1,
      updated_at = NOW()
    `;

    return Response.json({ok: true});

  }catch(error) {
    console.error(error);

    return Response.json(
      {error: 'server error'},
      {status: 500}
    )
  }
}
