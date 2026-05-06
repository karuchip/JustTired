import { sql } from "@/src/neon/neon";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const result = await sql`
    DELETE FROM tired_posts
    WHERE create_at < NOW() - INTERVAL '30 seconds'
    RETURNING id;
    `;

    return NextResponse.json({
      success: true,
      deletedCount: result.length,
    });

  }catch(error){
    console.error(error);

    return NextResponse.json(
      {error: 'cleanup failed'},
      {status: 500}
    )
  }
}
