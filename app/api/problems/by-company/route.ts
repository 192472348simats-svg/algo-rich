import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/problems/by-company
 *   No params → returns list of companies with problem counts
 *   ?company=Google → returns problems tagged with that company
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const company = req.nextUrl.searchParams.get("company");

  if (!company) {
    // Return all companies with counts
    const problems = await prisma.problem.findMany({
      where: {
        OR: [
          { companies: { not: null } },
          { companyTags: { not: null } },
        ],
      },
      select: { companies: true, companyTags: true },
    });

    const companyMap: Record<string, number> = {};

    for (const p of problems) {
      const tags = parseJsonArray(p.companies) ?? parseJsonArray(p.companyTags) ?? [];
      for (const tag of tags) {
        const normalized = tag.trim();
        if (normalized) {
          companyMap[normalized] = (companyMap[normalized] || 0) + 1;
        }
      }
    }

    const companies = Object.entries(companyMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({ companies });
  }

  // Return problems for specific company
  const allProblems = await prisma.problem.findMany({
    where: {
      OR: [
        { companies: { contains: company } },
        { companyTags: { contains: company } },
      ],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      difficulty: true,
      category: true,
      companies: true,
      companyTags: true,
    },
  });

  // Filter for exact match within JSON array
  const filtered = allProblems.filter((p) => {
    const tags = parseJsonArray(p.companies) ?? parseJsonArray(p.companyTags) ?? [];
    return tags.some((t) => t.trim().toLowerCase() === company.toLowerCase());
  });

  return NextResponse.json({
    company,
    count: filtered.length,
    problems: filtered.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      category: p.category,
    })),
  });
}

function parseJsonArray(val: string | null): string[] | null {
  if (!val) return null;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
