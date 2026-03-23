import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Database Health Check Endpoint
 * 
 * Purpose: Verify Neon database connectivity and wake up the database if it's idle
 * Endpoint: GET /api/health/db
 * 
 * Returns:
 *   - 200 OK: { ok: true } — Database is reachable
 *   - 503 Service Unavailable: { ok: false, error: "..." } — Database unreachable
 * 
 * Use Cases:
 *   - Health monitoring: curl http://localhost:3000/api/health/db
 *   - Neon cold-start: Call this endpoint to wake up idle database before other operations
 *   - CI/CD checks: Verify DB before running tests
 */
export async function GET() {
  try {
    // Execute a simple query to verify database connectivity
    const result = await prisma.$queryRawUnsafe("SELECT NOW() as timestamp");

    return NextResponse.json(
      { 
        ok: true,
        timestamp: (result as any)[0]?.timestamp,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Log error for debugging
    if (process.env.NODE_ENV === "development") {
      console.error("[API /health/db]", errorMessage);
    }

    return NextResponse.json(
      {
        ok: false,
        error: errorMessage,
      },
      { status: 503 } // Service Unavailable — database isn't ready
    );
  }
}
