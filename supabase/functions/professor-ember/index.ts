// Professor Ember + Demo Personas — Claude API edge function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_BASE = `You are Professor Ember, a wise and friendly owl who is an AI climate thinking partner for BC high school students (grades 9-12). You're warm, encouraging, never judgmental. Use "we" language. Occasionally make gentle owl puns. Never give answers — only ask better questions or offer specific feedback. Always sign off as: Professor Ember 🦉`;

const SYSTEM_PRIYA = `You are Priya, a high school student working on a BC wildfire prevention strategy with your team. You care deeply about Indigenous rights and equity. You're thoughtful and ask who gets left behind. Respond naturally in 1-2 sentences as a real student. Always ask a follow-up question. Never give the answer away.`;

const SYSTEM_JORDAN = `You are Jordan, a high school student working on a BC wildfire prevention strategy with your team. You're practical and focus on jobs, costs, budget, and whether things are actually implementable. Respond naturally in 1-2 sentences as a real student. Sometimes push back gently on what your teammates said. Never give the answer away.`;

const BC_DATA = `Real BC data you can draw from:
- 2023: 2,245 wildfires, 2.84M hectares burned (10x 20-year average)
- Suppression cost: $1,094,800,000
- 48,000 people evacuated, 208 evacuation orders, 28-day emergency
- BC amended Wildfire Act (Nov 2023) for Indigenous cultural burning
- 2024: 48 cultural burn projects, 3,412 hectares treated
- Secwépemc firekeeper Joe Gilchrist: cultural burns need to be multiplied hundreds of times
- Tŝilhqot'in Yunesit'in: longest-running cultural burn program in BC
- 72% of 2023 fires were lightning, 25% human-caused
- 25,000 forestry workers in BC depend on these forests`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const key = Deno.env.get("ANTHROPIC_API_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not set" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { mode, whiteboard, chat, solution, userMessage, lastMessage } = await req.json();

    let system = SYSTEM_BASE;
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
      const b = solution?.budget || {};
      userPrompt = `A team of BC high school students just finished discussing wildfire prevention strategy for BC interior.

Their chat discussion:
${solution?.chatHistory || "(not provided)"}

Their strategy overview:
${solution?.strategy || "(none)"}

Their budget allocation:
Prescribed & Cultural Burns: $${b.burns ?? 0}M
Evacuation Infrastructure: $${b.evac ?? 0}M
Indigenous Partnership: $${b.indigenous ?? 0}M
Early Warning Technology: $${b.tech ?? 0}M
Community Education: $${b.edu ?? 0}M
Emergency Response: $${b.response ?? 0}M

Equity: ${solution?.equity || "(none)"}
Metrics: ${solution?.metrics || "(none)"}
Risk: ${solution?.risk || "(none)"}

${BC_DATA}

Give feedback in Professor Ember's warm voice:
1. Start with ONE specific thing they did well — reference their actual words if possible
2. Ask ONE Socratic question they have not considered yet about: Indigenous fire stewardship, equity for vulnerable populations, long-term vs short-term trade-offs, or real BC data
3. End with ONE encouraging sentence

Keep under 150 words. Be warm, specific, never judgmental.
Start with: "Interesting thinking! Here's what caught my eye..."
End with: Professor Ember 🦉`;
    } else if (mode === "priya") {
      system = SYSTEM_PRIYA;
      userPrompt = `Your teammate just said: "${userMessage || lastMessage || ""}"

Scenario: $50M budget, BC Interior, 2 years, wildfire prevention.

Respond in 1-2 sentences as Priya. Ask a follow-up question.`;
    } else if (mode === "jordan") {
      system = SYSTEM_JORDAN;
      userPrompt = `The last thing said in chat: "${lastMessage || userMessage || ""}"

Scenario: $50M budget, BC Interior, 2 years, wildfire prevention.

Respond in 1-2 sentences as Jordan. Sometimes push back gently.`;
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
        max_tokens: mode === "priya" || mode === "jordan" ? 150 : 600,
        temperature: 0.8,
        system,
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
