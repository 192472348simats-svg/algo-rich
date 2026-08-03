import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type ProblemCompanyFields = {
  company: string | null;
  companies: string | null;
  companyTags: string | null;
};

function parseCompanies(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    // Older seed data may use a comma-separated value instead of JSON.
  }
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function companiesForProblem(problem: ProblemCompanyFields): string[] {
  return [...new Set([
    ...parseCompanies(problem.company),
    ...parseCompanies(problem.companies),
    ...parseCompanies(problem.companyTags),
  ])];
}

export async function GET(request: NextRequest) {
  try {
    const requestedCompany = request.nextUrl.searchParams.get("company")?.trim();
    const problems = await prisma.problem.findMany({
      where: { isActive: true },
      select: {
        id: true,
        slug: true,
        title: true,
        difficulty: true,
        company: true,
        companies: true,
        companyTags: true,
      },
    });

    if (requestedCompany) {
      const matchingProblems = problems.filter((problem) =>
        companiesForProblem(problem).some(
          (company) => company.toLowerCase() === requestedCompany.toLowerCase()
        )
      );
      return NextResponse.json({ problems: matchingProblems });
    }

    const counts = new Map<string, number>();
    for (const problem of problems) {
      for (const company of companiesForProblem(problem)) {
        counts.set(company, (counts.get(company) ?? 0) + 1);
      }
    }
    const companies = [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ companies });
  } catch (error) {
    console.error("[GET /api/problems/by-company]", error);
    return NextResponse.json({ error: "Failed to load company problems" }, { status: 500 });
  }
}
