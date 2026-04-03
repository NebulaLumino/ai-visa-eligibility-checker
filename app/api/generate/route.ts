import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nationality, education, workExperience, visaType, timeline, budgetTier } = body;

  if (!nationality) {
    return NextResponse.json({ error: 'Applicant nationality is required' }, { status: 400 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const prompt = `You are an experienced immigration attorney. Analyze visa eligibility and generate a comprehensive immigration pathway report:

**Applicant Nationality:** ${nationality}
**Education Level:** ${education || 'Not specified'}
**Work Experience:** ${workExperience || 'Not specified'}
**Visa Type of Interest:** ${visaType || 'General assessment requested'}
**Timeline Goal:** ${timeline || 'Flexible'}
**Budget Tier:** ${budgetTier || 'Standard'}

Please generate:

1. **ELIGIBLE VISA CATEGORIES** — A comprehensive list of visa categories the applicant may be eligible for, including:
   - Employment-based visas (H-1B, L-1, O-1, etc.)
   - Family-based visas (if applicable)
   - Investor/entrepreneur visas (E-2, EB-5)
   - Student visas (F-1, M-1)
   - Diversity Visa (if applicable)
   - Other special categories
   For each: eligibility requirements, processing time, duration, path to permanent residency

2. **APPLICATION TIMELINE** — A realistic timeline including:
   - Document gathering phase
   - Petition/preparation phase
   - Filing and USCIS processing
   - Consular processing (if applicable)
   - Total estimated time from start to approval
   - Premium processing options (if available)

3. **REQUIREMENTS CHECKLIST** — A detailed checklist for each promising visa category including:
   - Required forms (I-129, DS-160, etc.)
   - Supporting documentation
   - Financial requirements
   - Education/credential evaluation needs
   - English language requirements (if any)

4. **APPROVAL ODDS ESTIMATE** — An honest assessment of approval likelihood for top candidates, including:
   - Factors that strengthen the application
   - Potential challenges and weaknesses
   - Strategies to overcome weaknesses

5. **NEXT STEPS** — A prioritized action plan with specific steps to take immediately, including recommended immigration counsel considerations.

Format clearly with markdown headers and tables.`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `API error: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'No output generated.';

    return NextResponse.json({ result: content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Request failed: ${message}` }, { status: 500 });
  }
}
