import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Send, Flag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProfessorEmber, AskEmberButton } from "@/components/ProfessorEmber";
import { Footer } from "@/components/Footer";

const PHASE_NAMES = [
  "Briefing", "Team Discussion", "AI Guided Reflection",
  "Solution Draft", "AI Feedback", "Presentation",
];
const PHASE_SECONDS = [120, 420, 300, 480, 180, 300];

const BUDGET_ITEMS = [
  { key: "burns", icon: "🔥", title: "Prescribed & Cultural Burns (Indigenous-led)", fact: "2024: 48 BC cultural burn projects treated 3,412 hectares [BC Wildfire Service]" },
  { key: "evac", icon: "🚗", title: "Evacuation Infrastructure & Accessible Shelters", fact: "2023: 208 evacuation orders, 24,000 properties affected [BC Wildfire Service]" },
  { key: "indigenous", icon: "🤝", title: "Indigenous Partnership & Co-Management", fact: "BC amended Wildfire Act (Nov 2023) to expand Indigenous fire authority" },
  { key: "tech", icon: "📡", title: "Early-Warning Technology & FireSmart", fact: "25% of 2023 BC wildfires were human-caused and preventable" },
  { key: "edu", icon: "🏫", title: "Community Education & Behavior Change", fact: "FireSmart Canada helps communities prepare before fires start" },
  { key: "response", icon: "🚁", title: "Emergency Response Capacity", fact: "BC deployed crews to 6 other provinces in 2023" },
];

const STAKEHOLDERS = [
  { who: "🔥 Joe Gilchrist, Secwépemc Firekeeper, Merritt BC", quote: "Cultural burning needs to be multiplied hundreds of times. My people managed this land with fire for thousands of years before colonization stopped us. We can help — if you truly listen.", src: "The Narwhal, November 2025" },
  { who: "🌲 Timber Industry Rep, Prince George", quote: "Prevention is important, but every dollar spent here is a dollar not spent on the 25,000 forestry workers whose livelihoods depend on these forests. Balance matters." },
  { who: "🚒 BC Wildfire Service Fire Chief", quote: "We responded to 2,245 fires in 2023 alone. Our crews are exhausted. We need better early-warning systems and prevention — not just suppression after fires start." },
  { who: "🏠 Rural Community Member, Kamloops Area", quote: "After watching West Kelowna nearly burn down in August 2023, I need to know my family can evacuate safely. That's my number one priority." },
  { who: "🔬 Dr. Sarah Chen, Environmental Scientist, UBC", quote: "Fire seasons are starting 3 weeks earlier than 30 years ago. The Tŝilhqot'in Yunesit'in community runs the longest cultural burn program in BC. Western science is finally catching up to Indigenous knowledge.", src: "Gathering Voices Society" },
];

const FALLBACK_SOCRATIC = [
  "Interesting thinking! Here's what caught my eye... The Tŝilhqot'in Yunesit'in community has been running cultural burns every spring AND fall for years. BC just changed the Wildfire Act in November 2023 to give Indigenous Nations more fire authority. How does your strategy partner WITH Indigenous firekeepers — not just consult them, but actually share power?",
  "Here's something worth a hoot... West Kelowna residents had less than ONE HOUR to evacuate when the McDougall Creek fire hit in August 2023. Many of the 48,000 people evacuated were elderly, disabled, or without vehicles. How does YOUR plan specifically reach people who can't evacuate on their own?",
  "Let's zoom out for a second... Early-warning tech sounds great. But in 2023, many rural BC communities had zero cell coverage when evacuation orders went out. How does your system reach people with no reliable internet or cell service?",
  "Here's the big picture... BC spent $1,094,800,000 on suppression in 2023 — AFTER fires started. Your entire prevention budget is $50M, about 4.5% of one bad year. Research shows prevention saves 20x what suppression costs. How would WE make that argument to a minister who wants to cut prevention spending?",
];

const FALLBACK_FEEDBACK = (sol: any) => {
  const ind = Number(sol?.budget?.indigenous ?? 0);
  const burns = Number(sol?.budget?.burns ?? 0);
  const parts: string[] = [];
  if (ind < 5) parts.push("Your Indigenous co-management budget is lower than I expected. BC just amended the Wildfire Act specifically to expand Indigenous fire authority — and Secwépemc firekeepers like Joe Gilchrist say cultural burning needs to be 'multiplied hundreds of times.' What would it look like to double this allocation?");
  if (burns > 20) parts.push("Strong investment in cultural and prescribed burns — research shows this is the most cost-effective long-term prevention. Just make sure your plan centers Indigenous practitioners as leaders, not just consultants.");
  parts.push("Perspective check: BC spent $1,094,800,000 on suppression in 2023. Your entire prevention budget is $50M — 4.5% of what one bad year costs. How do you make THAT argument to a finance minister who wants to cut prevention spending next year?\n\n— Professor Ember 🦉");
  return parts.join("\n\n");
};

const Stat = ({ icon, big, label, src }: { icon: string; big: string; label: string; src?: string }) => (
  <Card className="p-5 bg-white border-l-4" style={{ borderLeftColor: "#ff6b35" }}>
    <div className="text-3xl mb-1">{icon}</div>
    <div className="text-2xl font-bold" style={{ color: "#2d5a3d" }}>{big}</div>
    <div className="text-sm text-muted-foreground mt-1">{label}</div>
    {src && <div className="text-xs text-muted-foreground mt-2 italic">[{src}]</div>}
  </Card>
);

const useTimer = (seconds: number, onEnd: () => void) => {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    setRemaining(seconds);
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(id); onEnd(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);
  return remaining;
};

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

const WildfireGame = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);
  const [emberMsg, setEmberMsg] = useState<string | null>(null);
  const [emberActions, setEmberActions] = useState<{ label: string; onClick: () => void; variant?: "default" | "outline" }[] | undefined>();
  const [showAskBtn, setShowAskBtn] = useState(false);
  const teamName = typeof window !== "undefined" ? (localStorage.getItem("wildfire_team_name") || "Team Cedar") : "Team Cedar";
  const teamCode = typeof window !== "undefined" ? (localStorage.getItem("wildfire_team_code") || "FIRE-0000") : "FIRE-0000";

  // Phase 2 state
  const [whiteboard, setWhiteboard] = useState("");
  const [chat, setChat] = useState<{ name: string; color: string; text: string }[]>([
    { name: "Priya", color: "#9b5de5", text: "Hey team! Where should we start? I keep thinking about Indigenous partnerships." },
    { name: "Jordan", color: "#0089cf", text: "Sounds good — but we also need to think about cost and what's actually doable in 2 years." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const lastUserMsgAtRef = useRef<number>(Date.now());
  const aiBusyRef = useRef(false);

  // Phase 3 state
  const [socraticQs, setSocraticQs] = useState<string[]>([]);
  const [shownCards, setShownCards] = useState(0);

  // Phase 4 state
  const [strategy, setStrategy] = useState("");
  const [budget, setBudget] = useState<Record<string, number>>({ burns: 10, evac: 8, indigenous: 8, tech: 10, edu: 7, response: 7 });
  const [equity, setEquity] = useState("");
  const [metrics, setMetrics] = useState("");
  const [risk, setRisk] = useState("");

  // Phase 5 state
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadingFb, setLoadingFb] = useState(false);

  // Phase 6 state
  const [finalThought, setFinalThought] = useState("");

  const budgetTotal = Object.values(budget).reduce((a, b) => a + b, 0);
  const phaseSeconds = PHASE_SECONDS[phase];
  const remaining = useTimer(phaseSeconds, () => advance());

  const advance = () => {
    setEmberMsg(null);
    setPhase((p) => Math.min(p + 1, 6));
  };

  // Show ember at phase 3 start; auto-trigger feedback when entering Phase 5
  useEffect(() => {
    if (phase >= 2) setShowAskBtn(true); else setShowAskBtn(false);
    if (phase === 2) showEmberPhase3();
    if (phase === 4) {
      // Auto-fire feedback at start of Phase 5 (no button click required)
      autoTriggerFeedback();
    }
    if (phase === 5) showEmberPhase6();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const callEmber = async (mode: "socratic" | "feedback" | "priya" | "jordan", extra?: Record<string, unknown>) => {
    try {
      const { data, error } = await supabase.functions.invoke("professor-ember", {
        body: mode === "socratic"
          ? { mode, whiteboard, chat: chat.map((c) => `${c.name}: ${c.text}`).join("\n") }
          : mode === "feedback"
          ? { mode, solution: { strategy, budget, equity, metrics, risk, chatHistory: chat.map((c) => `${c.name}: ${c.text}`).join("\n") } }
          : { mode, ...extra },
      });
      if (error) throw error;
      return (data as any)?.text || null;
    } catch (e) {
      console.warn("Ember API failed, using fallback", e);
      return null;
    }
  };

  // ---------- DEMO MODE: Priya + Jordan AI teammates ----------
  const PRIYA_FALLBACKS = [
    "I think we need to talk more about the Indigenous partnerships piece. The Secwépemc Nation has been doing this for thousands of years — how do we actually listen to them?",
    "Who gets left behind in our plan? I keep thinking about elderly people who can't evacuate on their own.",
    "What happens if we spend all our money on tech and then the cell towers go down during the fire?",
  ];
  const JORDAN_FALLBACKS = [
    "I hear you, but we also have to be realistic about jobs. 25,000 forestry workers depend on these forests.",
    "That sounds expensive. How do we know it'll actually work before we spend $20M on it?",
    "I think we need to prioritize things we can actually implement in 2 years, not just ideal solutions.",
  ];
  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  const respondAsPersona = async (persona: "priya" | "jordan", userMessage: string, lastMessage: string) => {
    const color = persona === "priya" ? "#9b5de5" : "#0089cf";
    const name = persona === "priya" ? "Priya" : "Jordan";
    const txt = await callEmber(persona, { userMessage, lastMessage });
    const finalText = txt || pick(persona === "priya" ? PRIYA_FALLBACKS : JORDAN_FALLBACKS);
    setChat((c) => [...c, { name, color, text: finalText }]);
  };

  // Trigger demo responses when user sends a chat message
  const triggerDemoResponse = (userMsg: string) => {
    if (aiBusyRef.current) return;
    aiBusyRef.current = true;
    const lower = userMsg.toLowerCase();
    const priyaTrigger = /(indigen|first nation|communit|people|equit|cultur)/i.test(lower);
    const jordanTrigger = /(money|budget|job|cost|industr|timber|econom)/i.test(lower);
    // Default: at least one always responds for demo richness
    const priyaWillRespond = priyaTrigger || (!priyaTrigger && !jordanTrigger);
    const jordanWillRespond = jordanTrigger || priyaWillRespond;

    setTimeout(async () => {
      if (priyaWillRespond) {
        await respondAsPersona("priya", userMsg, userMsg);
      }
      setTimeout(async () => {
        if (jordanWillRespond) {
          const last = priyaWillRespond ? "(Priya just responded)" : userMsg;
          await respondAsPersona("jordan", userMsg, last);
        }
        aiBusyRef.current = false;
      }, 3000);
    }, 2000 + Math.random() * 2000);
  };

  // Idle prompt: if 8s silence in phase 2, Priya nudges
  useEffect(() => {
    if (phase !== 1) return;
    const id = setInterval(() => {
      if (Date.now() - lastUserMsgAtRef.current > 8000 && !aiBusyRef.current) {
        lastUserMsgAtRef.current = Date.now();
        aiBusyRef.current = true;
        setTimeout(() => {
          setChat((c) => [...c, { name: "Priya", color: "#9b5de5", text: pick(PRIYA_FALLBACKS) }]);
          aiBusyRef.current = false;
        }, 1500);
      }
    }, 4000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const showEmberPhase3 = () => {
    setEmberMsg(`Hey there! 🦉 I'm Professor Ember, your AI climate thinking partner.\n\nI've been watching your team's discussion — you're asking great questions! Ready to go even deeper?\n\n👉 Want to hear my feedback on what your team has discussed so far?`);
    setEmberActions([
      {
        label: "✅ Yes, let's hear it, Professor Ember!",
        onClick: async () => {
          setEmberMsg("Let me take a hoot at your whiteboard... 🦉");
          setEmberActions(undefined);
          const txt = await callEmber("socratic");
          let qs: string[];
          if (txt) {
            qs = txt.split(/\n\s*\d+\.\s*/).map((s) => s.trim()).filter(Boolean).slice(0, 4);
            if (qs.length < 4) qs = FALLBACK_SOCRATIC;
          } else {
            qs = FALLBACK_SOCRATIC;
          }
          setSocraticQs(qs);
          setShownCards(1);
          setEmberMsg(null);
        },
      },
      { label: "⏭ Skip for now — we've got this", variant: "outline", onClick: () => { setSocraticQs(FALLBACK_SOCRATIC); setShownCards(1); setEmberMsg(null); } },
    ]);
  };

  // Reveal socratic cards one by one
  useEffect(() => {
    if (phase !== 2 || socraticQs.length === 0) return;
    if (shownCards >= socraticQs.length) return;
    const t = setTimeout(() => setShownCards((s) => s + 1), 45000);
    return () => clearTimeout(t);
  }, [phase, shownCards, socraticQs]);

  // Auto-trigger Ember feedback at the start of Phase 5
  const autoTriggerFeedback = async () => {
    setEmberMsg(null);
    setEmberActions(undefined);
    setLoadingFb(true);
    setFeedback(null);
    const txt = await callEmber("feedback");
    setFeedback(txt || FALLBACK_FEEDBACK({ budget }));
    setLoadingFb(false);
  };

  const showEmberPhase6 = () => {
    setEmberMsg(`You made it! 🎓🦉\n\nWhether your strategy was perfect or not, you just did something most adults never do — you sat down and seriously thought about one of BC's hardest problems. That matters.\n\nHere's one last question: What's ONE thing from today that you'll still remember next month?`);
    setEmberActions(undefined);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChat((c) => [...c, { name: "You", color: "#2d5a3d", text: msg }]);
    setChatInput("");
    lastUserMsgAtRef.current = Date.now();
    triggerDemoResponse(msg);
  };

  // Floating "Ask Professor Ember" handler — context-aware
  const handleAskEmber = async () => {
    if (phase >= 3) {
      setEmberMsg("Professor Ember is thinking... 🦉");
      setEmberActions(undefined);
      const txt = await callEmber("feedback");
      setEmberMsg(txt || FALLBACK_FEEDBACK({ budget }));
      setEmberActions([{ label: "Thanks, Professor!", onClick: () => setEmberMsg(null) }]);
    } else {
      showEmberPhase3();
    }
  };

  // Score calculation
  const scoreParts = phase === 6 ? [
    { label: "Budget balanced to $50M", ok: budgetTotal === 50 },
    { label: "Equity section completed", ok: equity.trim().length > 20 },
    { label: "Indigenous partnership in budget", ok: budget.indigenous >= 5 },
    { label: "All 6 budget categories addressed", ok: Object.values(budget).every((v) => v > 0) },
    { label: "Strategy described", ok: strategy.trim().length > 30 },
    { label: "Success metrics defined", ok: metrics.trim().length > 20 },
  ] : [];
  const scorePct = scoreParts.length ? Math.round((scoreParts.filter((s) => s.ok).length / scoreParts.length) * 100) : 0;
  const tier = scorePct >= 90 ? "🏆 Climate Strategist — Your team thinks like real policymakers"
    : scorePct >= 70 ? "🌟 Climate Analyst — Strong thinking with room to go deeper"
    : scorePct >= 50 ? "🔥 Climate Trainee — Good start. Real solutions take practice"
    : "🌱 Climate Apprentice — Every expert started here. Try again!";

  const timerColor = remaining <= 60 ? "#ff0000" : remaining <= 120 ? "#ff6b35" : "#2d5a3d";

  return (
    <main className="min-h-screen" style={{ background: "#fbf6ea" }}>
      {/* Persistent header */}
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="container max-w-7xl py-3 flex items-center justify-between gap-4">
          <div>
            <Link to="/wildfire" className="inline-flex items-center text-xs hover:underline" style={{ color: "#2d5a3d" }}>
              <ArrowLeft className="h-3 w-3 mr-1" /> Lobby
            </Link>
            <div className="text-sm font-bold" style={{ color: "#2d5a3d" }}>{teamName} · {teamCode}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Phase {phase + 1} of 6</div>
            <div className="font-bold">{PHASE_NAMES[phase] || "Results"}</div>
          </div>
          {phase < 6 ? (
            <div className="text-right">
              <div className="font-bold tabular-nums" style={{ fontSize: "32px", color: timerColor }}>
                {formatTime(remaining)}
              </div>
            </div>
          ) : <div className="w-20" />}
        </div>
      </div>

      <div className="container max-w-7xl py-6">
        {/* PHASE 1 BRIEFING */}
        {phase === 0 && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-3xl font-bold mb-2" style={{ color: "#2d5a3d", fontFamily: "Fraunces, serif" }}>
                ⚠️ BC Interior Wildfire Crisis — Your Mission
              </h2>
              <p className="text-muted-foreground mb-6">What happened in BC's 2023 wildfire season:</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat icon="📊" big="2.84M ha" label="burned — 10x the 20-year average" src="BC Wildfire Service, 2023" />
                <Stat icon="💸" big="$1.09B" label="suppression cost in one season" src="BC Wildfire Service, 2023" />
                <Stat icon="🏠" big="48,000" label="evacuated — 208 evacuation orders" src="BC Wildfire Service, 2023" />
                <Stat icon="⚡" big="72%" label="lightning-caused; 25% human-caused" src="BC Wildfire Service, 2023" />
              </div>
            </Card>

            <Card className="p-6 bg-glacier/30 border-2" style={{ borderColor: "#2d5a3d" }}>
              <h3 className="font-bold mb-3" style={{ color: "#2d5a3d" }}>Your Mission</h3>
              <p className="text-sm leading-relaxed">
                You're on the BC Interior Regional Fire Prevention Council.<br />
                💰 Budget: <b>$50,000,000</b> (2-year)<br />
                📍 Region: BC Interior (Thompson-Okanagan-Cariboo)<br />
                👥 Population at risk: 400,000 residents<br />
                ⏱ Timeline: 2 years<br />
                🎯 Goal: Design the most effective wildfire prevention strategy
              </p>
            </Card>

            <div>
              <h3 className="font-bold mb-3">Stakeholder Voices</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {STAKEHOLDERS.map((s, i) => (
                  <Card key={i} className="p-4">
                    <div className="text-xs font-bold mb-2">{s.who}</div>
                    <p className="text-sm italic text-muted-foreground">"{s.quote}"</p>
                    {s.src && <div className="text-xs text-muted-foreground mt-2">— {s.src}</div>}
                  </Card>
                ))}
              </div>
            </div>

            <Button onClick={advance} size="lg" className="bg-[#2d5a3d] hover:bg-[#2d5a3d]/90 text-white">
              ✅ Our team is ready — Start Discussion →
            </Button>
          </div>
        )}

        {/* PHASE 2 DISCUSSION */}
        {phase === 1 && (
          <div className="grid lg:grid-cols-[1fr_300px_1fr] gap-4">
            <Card className="p-4">
              <div className="font-bold mb-2" style={{ color: "#2d5a3d" }}>📋 Shared Whiteboard</div>
              <Textarea
                value={whiteboard}
                onChange={(e) => setWhiteboard(e.target.value)}
                placeholder={"Organize your ideas here:\n💡 What should we prioritize?\n💰 How should we split the $50M?\n🤔 What are the trade-offs?"}
                className="min-h-[400px] font-mono text-sm"
              />
            </Card>
            <Card className="p-4 text-sm">
              <div className="font-bold mb-3" style={{ color: "#2d5a3d" }}>Scenario Reference</div>
              <p>Budget: <b>$50M</b></p>
              <p>Timeline: 2 years</p>
              <p>Population: 400,000 at risk</p>
              <p className="mt-2 text-xs text-muted-foreground">Key stat: 2023 cost: <b>$1.09 BILLION</b> in suppression</p>
              <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
                {STAKEHOLDERS.map((s, i) => (
                  <div key={i} className="text-xs border-l-2 pl-2" style={{ borderColor: "#0089cf" }}>
                    <div className="font-semibold">{s.who.split(",")[0]}</div>
                    <div className="italic text-muted-foreground">"{s.quote.slice(0, 80)}..."</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-4 flex flex-col">
              <div className="font-bold mb-2" style={{ color: "#2d5a3d" }}>💬 Team Chat</div>
              <div className="text-[11px] px-2 py-1.5 mb-2 rounded bg-glacier/40 border" style={{ borderColor: "#2d5a3d" }}>
                🎭 Demo Mode — AI teammates are simulating a real student discussion
              </div>
              <div className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto space-y-2 mb-3 text-sm">
                {chat.map((c, i) => {
                  const initial = c.name === "You" ? "Y" : c.name[0];
                  return (
                    <div key={i} className="flex gap-2 items-start">
                      <span
                        className="h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                        style={{ background: c.color }}
                      >
                        {initial}
                      </span>
                      <div>
                        <span className="font-semibold" style={{ color: c.color }}>{c.name}</span>
                        <div>{c.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Share your thoughts..." onKeyDown={(e) => e.key === "Enter" && sendChat()} />
                <Button size="icon" onClick={sendChat}><Send className="h-4 w-4" /></Button>
              </div>
            </Card>
          </div>
        )}

        {/* PHASE 3 REFLECTION */}
        {phase === 2 && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold" style={{ color: "#2d5a3d" }}>🦉 AI Guided Reflection</h2>
            <p className="text-sm text-muted-foreground">Professor Ember has questions to help your team think deeper.</p>
            {socraticQs.slice(0, shownCards).map((q, i) => (
              <Card key={i} className="p-5 border-l-4 animate-fade-in" style={{ borderLeftColor: "#2d5a3d" }}>
                <div className="text-xs uppercase font-bold mb-2" style={{ color: "#2d5a3d" }}>Professor Ember says 🦉 — Question {i + 1}</div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{q}</p>
              </Card>
            ))}
            <Button onClick={advance} variant="outline">Continue to Solution Draft →</Button>
          </div>
        )}

        {/* PHASE 4 SOLUTION */}
        {phase === 3 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold" style={{ color: "#2d5a3d", fontFamily: "Fraunces, serif" }}>
              📝 Your Wildfire Prevention Strategy
            </h2>

            <Card className="p-5">
              <label className="font-bold block mb-2">Strategy Overview</label>
              <Textarea value={strategy} onChange={(e) => setStrategy(e.target.value)} placeholder="Our team will focus on... because..." className="min-h-[120px]" />
            </Card>

            <Card className="p-5">
              <div className="flex justify-between items-baseline mb-4">
                <label className="font-bold">Budget Allocation (millions)</label>
                <div className={`text-xl font-bold ${budgetTotal === 50 ? "text-green-600" : budgetTotal > 50 ? "text-red-600" : "text-orange-500"}`}>
                  ${budgetTotal}M / $50M
                </div>
              </div>
              <Progress value={(budgetTotal / 50) * 100} className="mb-4" />
              <div className="space-y-4">
                {BUDGET_ITEMS.map((b) => (
                  <div key={b.key}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{b.icon} {b.title}</span>
                      <Input
                        type="number"
                        value={budget[b.key]}
                        onChange={(e) => setBudget({ ...budget, [b.key]: Math.max(0, Math.min(50, Number(e.target.value) || 0)) })}
                        className="w-20 h-8 text-right"
                      />
                    </div>
                    <Slider value={[budget[b.key]]} onValueChange={(v) => setBudget({ ...budget, [b.key]: v[0] })} max={50} step={1} />
                    <p className="text-xs text-muted-foreground mt-1 italic">{b.fact}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <label className="font-bold block mb-2">Equity Analysis</label>
              <p className="text-xs text-muted-foreground mb-2">Consider Indigenous communities, rural residents, elderly, people with disabilities, low-income families.</p>
              <Textarea value={equity} onChange={(e) => setEquity(e.target.value)} className="min-h-[100px]" />
            </Card>

            <Card className="p-5">
              <label className="font-bold block mb-2">Success Metrics</label>
              <Textarea value={metrics} onChange={(e) => setMetrics(e.target.value)} placeholder="How will you know your plan worked in 2 years?" className="min-h-[80px]" />
            </Card>

            <Card className="p-5">
              <label className="font-bold block mb-2">Biggest Risk</label>
              <Textarea value={risk} onChange={(e) => setRisk(e.target.value)} placeholder="What could go wrong?" className="min-h-[80px]" />
            </Card>

            <Button onClick={advance} size="lg" className="bg-[#2d5a3d] hover:bg-[#2d5a3d]/90 text-white">
              Submit Strategy → Get AI Feedback
            </Button>
          </div>
        )}

        {/* PHASE 5 FEEDBACK */}
        {phase === 4 && (
          <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <Card className="p-5">
              <h3 className="font-bold mb-3" style={{ color: "#2d5a3d" }}>Your Team's Strategy</h3>
              <div className="text-sm space-y-3">
                <div><b>Overview:</b> {strategy || "(none)"}</div>
                <div>
                  <b className="block mb-2">Budget Allocation:</b>
                  <ul className="space-y-1">
                    {[
                      { key: "burns", icon: "🔥", label: "Prescribed & Cultural Burns" },
                      { key: "evac", icon: "🚗", label: "Evacuation Infrastructure" },
                      { key: "indigenous", icon: "🤝", label: "Indigenous Partnership" },
                      { key: "tech", icon: "📡", label: "Early Warning Technology" },
                      { key: "edu", icon: "🏫", label: "Community Education" },
                      { key: "response", icon: "🚁", label: "Emergency Response" },
                    ].map((b) => (
                      <li key={b.key} className="flex justify-between border-b border-dashed pb-1">
                        <span>{b.icon} <b>{b.label}:</b></span>
                        <span className="font-bold" style={{ color: "#2d5a3d" }}>${budget[b.key]}M</span>
                      </li>
                    ))}
                    <li className="flex justify-between pt-2 font-bold">
                      <span>Total:</span>
                      <span style={{ color: budgetTotal === 50 ? "#2d5a3d" : "#ff6b35" }}>
                        ${budgetTotal}M {budgetTotal === 50 ? "✅" : "⚠️"}
                      </span>
                    </li>
                  </ul>
                </div>
                <div><b>Equity:</b> {equity || "(none)"}</div>
                <div><b>Metrics:</b> {metrics || "(none)"}</div>
                <div><b>Risk:</b> {risk || "(none)"}</div>
              </div>
            </Card>
            <Card className="p-5 border-2" style={{ borderColor: "#2d5a3d" }}>
              <h3 className="font-bold mb-3" style={{ color: "#2d5a3d" }}>🦉 Professor Ember's Feedback</h3>
              {loadingFb && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-block h-3 w-3 rounded-full animate-pulse" style={{ background: "#2d5a3d" }} />
                  Professor Ember is thinking... 🦉
                </div>
              )}
              {feedback && <p className="text-sm whitespace-pre-wrap leading-relaxed animate-fade-in">{feedback}</p>}
              {!feedback && !loadingFb && (
                <Button size="sm" onClick={autoTriggerFeedback} className="bg-[#2d5a3d] hover:bg-[#2d5a3d]/90 text-white">
                  Get Professor Ember's feedback
                </Button>
              )}
            </Card>
            <Button onClick={advance} className="bg-[#2d5a3d] hover:bg-[#2d5a3d]/90 text-white lg:col-span-2">
              Continue to Real-World Comparison →
            </Button>
          </div>
        )}

        {/* PHASE 6 PRESENTATION */}
        {phase === 5 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <Card className="p-5">
              <h3 className="font-bold mb-3" style={{ color: "#2d5a3d" }}>Your Team's Final Strategy</h3>
              <div className="text-sm space-y-2">
                <p>{strategy}</p>
                <p className="text-xs text-muted-foreground">{BUDGET_ITEMS.map((b) => `${b.icon} $${budget[b.key]}M`).join(" · ")}</p>
              </div>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => toast.success("Shared with teacher")}>📤 Share with Teacher</Button>
            </Card>

            <Card className="p-5">
              <h3 className="font-bold mb-3" style={{ color: "#2d5a3d" }}>How does your strategy compare to BC's real approach?</h3>
              <div className="space-y-3 text-sm">
                <div>✅ <b>Cultural & Prescribed Burns:</b> BC amended Wildfire Act (Nov 2023). 2024: 48 projects, 3,412 ha. 2025: 88 planned. [BC Wildfire Service]</div>
                <div>✅ <b>Indigenous Partnerships:</b> Partnered with FNESS. Tŝilhqot'in Yunesit'in: longest cultural burn program in BC. [Gathering Voices Society; Indiginews 2026]</div>
                <div>✅ <b>Community Preparedness:</b> FireSmart Canada expanded across BC.</div>
                <div>❌ <b>Still needed:</b> Better accessible evacuation infrastructure for elderly & disabled.</div>
                <div>❌ <b>Still needed:</b> Improved early-warning for rural areas with poor cell/internet.</div>
              </div>
            </Card>

            <Card className="p-5">
              <label className="font-bold block mb-2">One final thought (just for you)</label>
              <Textarea value={finalThought} onChange={(e) => setFinalThought(e.target.value)} placeholder="Type your answer here..." className="min-h-[80px]" />
              <Button size="sm" variant="outline" className="mt-3" onClick={() => toast.success("Shared with your teacher")}>📤 Share with my teacher</Button>
            </Card>

            <Button onClick={advance} size="lg" className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white">
              🏁 Submit Final Strategy
            </Button>
          </div>
        )}

        {/* RESULTS */}
        {phase === 6 && (
          <div className="space-y-6 max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold" style={{ color: "#2d5a3d", fontFamily: "Fraunces, serif" }}>
              🎓 Results
            </h2>
            <div className="text-6xl font-bold" style={{ color: "#ff6b35" }}>{scorePct}%</div>
            <p className="text-xl font-semibold">{tier}</p>

            <Card className="p-5 text-left">
              <h3 className="font-bold mb-3">Score Breakdown</h3>
              <ul className="space-y-2 text-sm">
                {scoreParts.map((s, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{s.label}</span>
                    <span>{s.ok ? "✅" : "❌"}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" onClick={() => toast.success("Emailed to teacher")}>📧 Email Results to Teacher</Button>
              <Button variant="outline" onClick={() => toast.success("Saved")}>📊 Save to Dashboard</Button>
              <Button onClick={() => navigate("/wildfire")} className="bg-[#2d5a3d] hover:bg-[#2d5a3d]/90 text-white">
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Floating: report + ask ember */}
      <button
        onClick={() => toast.info("Reported to teacher")}
        className="fixed bottom-6 left-6 z-30 rounded-full bg-white border shadow px-3 py-2 text-xs flex items-center gap-1.5"
      >
        <Flag className="h-3.5 w-3.5" /> Report to Teacher
      </button>

      {showAskBtn && !emberMsg && (
        <AskEmberButton onClick={() => showEmberPhase3()} />
      )}

      {emberMsg && (
        <ProfessorEmber message={emberMsg} actions={emberActions} onClose={() => setEmberMsg(null)} />
      )}

      <Footer />
    </main>
  );
};

export default WildfireGame;
