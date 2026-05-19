// Professor Ember — Claude API edge function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_BASE = `You are Professor Ember, a wise and friendly owl who is an AI climate thinking partner for BC high school students (grades 9-12). You're warm, encouraging, never judgmental. Use "we" language. Occasionally make gentle owl puns. Never give answers — only ask better questions or offer specific feedback. Always sign off as: Professor Ember 🦉`;

const BC_DATA = `Real BC data you can draw from:
- 2023: 2,245 wildfires, 2.84M hectares burned (10x 20-year average)
- Suppression cost: $1,094,800,000
- 48,000 people evacuated, 208 evacuation orders
- BC amended Wildfire Act (Nov 2023) for Indigenous cultural burning
- 2024: 48 cultural burn projects, 3,412 hectares treated
- Secwépemc firekeeper Joe Gilchrist advocates multiplying cultural burns
- Tŝilhqot'in Yunesit'in: longest-running cultural burn program in BC
- 72% of 2023 fires were lightning, 25% human-caused`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const key = Deno.env.get("ANTHROPIC_API_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not set" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { mode, whiteboard, chat, solution } = await req.json();

    let userPrompt = "";
    if (mode === "socratic") {
      userPrompt = `A team is working on wildfire prevention strategy for BC's interior.

Whiteboard:
${whiteboard || "(empty)"}

Chat:
${chat || "(empty)"}

${BC_DATA}

Generate 4 short Socratic questions in your voice that:
1. Help them think deeper about Indigenous fire stewardship (Secwépemc, Tŝilhqot'in)
2. Push equity considerations (elderly, disabled, rural)
3. Challenge their budget assumptions
4. Connect their local decision to the bigger BC climate picture

Keep each question under 3 sentences. Start: "Interesting thinking! Here's what caught my eye..."
Return as a numbered list (1. 2. 3. 4.).`;
    } else if (mode === "feedback") {
      userPrompt = `A team submitted their wildfire prevention strategy:

Strategy: ${solution?.strategy || ""}
Budget: ${JSON.stringify(solution?.budget || {})}
Equity: ${solution?.equity || ""}
Metrics: ${solution?.metrics || ""}
Risk: ${solution?.risk || ""}

${BC_DATA}

Give feedback in your voice:
1. Start with ONE specific thing they did really well
2. Point out ONE thing they may not have considered (use real BC data)
3. Ask ONE final question that leaves them thinking

Keep under 200 words. Use "we" language. Sign off as Professor Ember 🦉`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid mode" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        temperature: 0.7,
        system: SYSTEM_BASE,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("Claude error", resp.status, errText);
      return new Response(JSON.stringify({ error: `Claude API ${resp.status}` }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const text = data?.content?.[0]?.text ?? "";
    return new Response(JSON.stringify({ text }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Ember error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
