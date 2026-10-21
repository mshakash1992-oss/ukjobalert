import { NextResponse } from "next/server";
import { getPublicJobs } from "@/lib/public-jobs";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json({ jobs: await getPublicJobs() }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { console.error("Public jobs retrieval failed", error); return NextResponse.json({ error: "Unable to load vacancies" }, { status: 503 }); }
}
