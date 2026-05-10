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
