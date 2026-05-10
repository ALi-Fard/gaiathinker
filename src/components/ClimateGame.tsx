// ============================================================
// ClimateGame.tsx
// GaiaThinker: Sort it out — Cause, Impact, or Solution?
// ------------------------------------------------------------
// Drop this file into: src/components/ClimateGame.tsx
// It replaces your existing ClimateGame component.
// No new dependencies — uses shadcn/ui, lucide-react, Tailwind
// (all already in your project).
// ============================================================

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Flame,
  CheckCircle2,
  XCircle,
  Trophy,
  Sparkles,
  Zap,
  RotateCcw,
  ChevronRight,
  MapPin,
  Lightbulb,
  TrendingUp,
  Target,
} from "lucide-react";

// ============================================================
// DATA — All BC climate cards
// ------------------------------------------------------------
// Teacher note: To add or edit cards, modify this array.
// Each card needs:
//   id, title, description, category, bcConnection,
//   explanation, statistic (the "wow" data point shown
//   after answering), and difficulty (1=easy, 2=medium, 3=tricky)
// ============================================================

type Category = "cause" | "impact" | "solution";

interface ClimateCard {
  id: string;
  title: string;
  description: string;
  category: Category;
  bcConnection: string;
  explanation: string;
  statistic: string;
  difficulty: 1 | 2 | 3;
}

const CARDS: ClimateCard[] = [
  // ------- CAUSES -------
  {
    id: "c-gasoline",
    title: "Gasoline-powered commutes across Metro Vancouver",
    description: "Cars and trucks burning gasoline release CO₂ into the atmosphere.",
    category: "cause",
    bcConnection: "Transportation is BC's #1 source of greenhouse-gas emissions.",
    explanation: "Tailpipe emissions are a primary driver of climate change. This is why CleanBC prioritizes electric vehicles and transit expansion.",
    statistic: "≈40% of BC's emissions come from transportation",
    difficulty: 1,
  },
  {
    id: "c-natgas",
    title: "Expanding LNG extraction and export from Kitimat",
    description: "Producing and shipping liquefied natural gas releases CO₂ and methane leaks.",
    category: "cause",
    bcConnection: "LNG Canada in Kitimat is one of the largest industrial emissions sources in BC.",
    explanation: "Even though natural gas burns cleaner than coal, methane leaks across the supply chain make its full climate footprint significant.",
    statistic: "Methane traps 80× more heat than CO₂ over 20 years",
    difficulty: 2,
  },
  {
    id: "c-deforestation",
    title: "Clear-cut logging of old-growth coastal forests",
    description: "Cutting forests releases stored carbon and removes a long-term carbon sink.",
    category: "cause",
    bcConnection: "Old-growth on Vancouver Island and the Central Coast holds some of Earth's densest carbon stores.",
    explanation: "Forests pull CO₂ from the air and store it in wood and soil. When cleared faster than they regrow, that carbon returns to the atmosphere.",
    statistic: "BC's old-growth forests store ≈1,000 tonnes carbon per hectare",
    difficulty: 1,
  },
  {
    id: "c-methane-livestock",
    title: "Methane from Fraser Valley dairy operations",
    description: "Cattle digestion and waste decomposition release methane, a potent greenhouse gas.",
    category: "cause",
    bcConnection: "BC's dairy industry is concentrated in the Fraser Valley near Abbotsford and Chilliwack.",
    explanation: "Methane is a short-lived but powerful greenhouse gas. Reducing it is one of the fastest ways to slow near-term warming.",
    statistic: "Agriculture: ≈6% of BC emissions",
    difficulty: 2,
  },
  {
    id: "c-cement",
    title: "Producing cement for Metro Vancouver construction",
    description: "Cement manufacturing emits CO₂ from both fuel use and chemical reactions.",
    category: "cause",
    bcConnection: "Lafarge's Richmond plant supplies much of the region's concrete.",
    explanation: "Cement alone accounts for roughly 7–8% of global emissions, making low-carbon concrete a major climate frontier.",
    statistic: "Global cement: ≈8% of all CO₂ emissions",
    difficulty: 3,
  },

  // ------- IMPACTS -------
  {
    id: "i-heatdome",
    title: "The 2021 heat dome killing hundreds of British Columbians",
    description: "A record-shattering heat wave pushed Lytton to 49.6°C before the village burned the next day.",
    category: "impact",
    bcConnection: "BC's deadliest weather disaster killed 619 people — most in their homes without air conditioning.",
    explanation: "Climate scientists determined this heat dome was virtually impossible without human-caused warming. It's a consequence, not a cause.",
    statistic: "619 deaths · Lytton hit 49.6°C",
    difficulty: 1,
  },
  {
    id: "i-wildfire-smoke",
    title: "Wildfire smoke days tripling since 2010",
    description: "BC residents now breathe wildfire smoke for weeks each summer, harming lungs and hearts.",
    category: "impact",
    bcConnection: "Kamloops, Kelowna, and even coastal cities like New Westminster regularly issue air-quality advisories.",
    explanation: "Hotter, drier summers extend fire seasons and intensify smoke — a clear downstream impact.",
    statistic: "2023: 28,000+ km² burned in BC — a record",
    difficulty: 1,
  },
  {
    id: "i-salmon",
    title: "Fraser River sockeye runs collapsing",
    description: "Warmer rivers stress salmon, and recent runs have been the smallest on record.",
    category: "impact",
    bcConnection: "The Big Bar landslide and warming Fraser temperatures devastated sockeye — a crisis for First Nations.",
    explanation: "Salmon need cold, oxygen-rich water. Climate-driven heat pushes river temperatures past lethal thresholds.",
    statistic: "2020 sockeye return: 290,000 (vs. 4M+ historic)",
    difficulty: 1,
  },
  {
    id: "i-shellfish",
    title: "Pacific shellfish dying from ocean acidification",
    description: "Oceans absorb CO₂ and become more acidic, dissolving the shells of young oysters and clams.",
    category: "impact",
    bcConnection: "Baynes Sound near Comox — where most of BC's oysters are farmed — has seen repeated mass die-offs.",
    explanation: "Ocean acidification is a measured chemical impact of higher atmospheric CO₂, hitting shellfish hardest.",
    statistic: "Ocean pH has dropped ≈0.1 since pre-industrial — a 26% rise in acidity",
    difficulty: 2,
  },
  {
    id: "i-sealevel",
    title: "Sea-level rise threatening New Westminster's waterfront",
    description: "Higher seas combine with king tides and storm surges to flood riverfront communities.",
    category: "impact",
    bcConnection: "New Westminster and Richmond are upgrading dikes for projected 1m+ sea-level rise by 2100.",
    explanation: "Sea-level rise from melting ice and warming oceans is a direct, observable impact along BC's coast.",
    statistic: "BC projection: up to 1m sea-level rise by 2100",
    difficulty: 1,
  },
  {
    id: "i-glacier",
    title: "Coast Mountain glaciers retreating rapidly",
    description: "BC's glaciers are shrinking, threatening summer water supplies for rivers and farms.",
    category: "impact",
    bcConnection: "The Place Glacier near Pemberton has lost over 20% of its mass since the 1980s.",
    explanation: "Glacier melt is one of the most visible long-term impacts of sustained warming.",
    statistic: "Western Canadian glaciers: 70% mass loss projected by 2100",
    difficulty: 2,
  },
  {
    id: "i-pinebeetle",
    title: "Mountain pine beetle decimating interior forests",
    description: "Warmer winters let beetles survive and explode in numbers, killing vast stands of pine.",
    category: "impact",
    bcConnection: "BC's interior lost about half its merchantable lodgepole pine since the late 1990s.",
    explanation: "Cold winters used to kill beetles. Climate change removed that natural check — a cascading impact.",
    statistic: "≈18 million hectares of BC forest affected",
    difficulty: 3,
  },

  // ------- SOLUTIONS -------
  {
    id: "s-heatpump",
    title: "Switching home heating from gas to electric heat pumps",
    description: "Heat pumps use electricity to move heat efficiently — in BC, that electricity is mostly clean.",
    category: "solution",
    bcConnection: "BC and federal CleanBC rebates can cover thousands of dollars of a heat-pump install.",
    explanation: "Replacing gas furnaces with heat pumps is one of the highest-impact household climate actions in BC.",
    statistic: "Heat pumps cut home heating emissions by ≈75%",
    difficulty: 1,
  },
  {
    id: "s-transit",
    title: "Expanding SkyTrain and electric bus networks",
    description: "Public transit moves more people per unit of energy and cuts tailpipe emissions.",
    category: "solution",
    bcConnection: "The Surrey-Langley SkyTrain extension and electric bus rollout are flagship low-carbon projects.",
    explanation: "Shifting trips from cars to electric transit is a classic, evidence-based mitigation solution.",
    statistic: "TransLink moves 1M+ trips per day on clean electricity",
    difficulty: 1,
  },
  {
    id: "s-indigenous",
    title: "Indigenous-led Guardian stewardship programs",
    description: "Coastal Guardian Watchmen monitor ecosystems using traditional knowledge and modern science.",
    category: "solution",
    bcConnection: "The Coastal Guardian Watchmen on BC's Central and North Coasts protect forests, salmon, and shorelines.",
    explanation: "Indigenous-led stewardship consistently produces better biodiversity and carbon outcomes — a solution rooted in millennia of knowledge.",
    statistic: "Indigenous-managed lands hold ≈80% of global biodiversity",
    difficulty: 2,
  },
  {
    id: "s-oldgrowth",
    title: "Protecting at-risk old-growth forests",
    description: "Standing old-growth stores enormous carbon and supports biodiversity.",
    category: "solution",
    bcConnection: "Fairy Creek and the Great Bear Rainforest are high-profile examples of old-growth protection in BC.",
    explanation: "Avoided deforestation is one of the fastest, cheapest climate solutions available.",
    statistic: "BC pledged to defer logging on 2.6M ha of at-risk old-growth",
    difficulty: 2,
  },
  {
    id: "s-renewables",
    title: "Building wind and run-of-river power",
    description: "Renewable electricity displaces fossil generation and supports electrification.",
    category: "solution",
    bcConnection: "BC Hydro's 2024 call for new wind power and Kwoiek Creek (a Kanaka Bar Indian Band partnership) show the range of options.",
    explanation: "Adding clean electricity is foundational to almost every other climate solution.",
    statistic: "BC's grid: ≈98% renewable already (hydro-dominated)",
    difficulty: 2,
  },
  {
    id: "s-active",
    title: "Walking, cycling, and rolling to school",
    description: "Active transportation cuts emissions and improves student health and focus.",
    category: "solution",
    bcConnection: "New Westminster's Agnes Greenway and protected bike lanes connect schools to neighbourhoods car-free.",
    explanation: "Even small daily choices add up — especially when paired with safer infrastructure.",
    statistic: "Cycling = ≈21× less CO₂ per km than driving",
    difficulty: 1,
  },
  {
    id: "s-flood",
    title: "Restoring wetlands and building 'living dikes'",
    description: "Combining engineered dikes with restored wetlands protects communities from flooding.",
    category: "solution",
    bcConnection: "After the 2021 atmospheric river flooded Sumas Prairie, BC began investing in living-dike approaches at Boundary Bay.",
    explanation: "Adaptation is also a solution — it reduces the harm from impacts already locked in.",
    statistic: "2021 Sumas flood damage: $1B+ in losses",
    difficulty: 3,
  },
  {
    id: "s-localfood",
    title: "Eating more local, plant-rich foods",
    description: "Shifting diets toward plants and local produce lowers food-system emissions.",
    category: "solution",
    bcConnection: "Fraser Valley farms supply Metro Vancouver schools and farmers' markets year-round.",
    explanation: "Food choices won't solve climate change alone, but plant-rich diets are among the most accessible personal solutions.",
    statistic: "Food: ≈26% of global emissions; ≈80% of that is animal-source",
    difficulty: 2,
  },
];

// Game configuration
const GAME_LENGTH = 10;
const POINTS_EASY = 10;
const POINTS_MEDIUM = 15;
const POINTS_HARD = 25;
const STREAK_BONUS = 5;

// ============================================================
// HELPERS
// ============================================================
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildDeck = (): ClimateCard[] => {
  // Balanced deck: mix of difficulties and categories
  const causes = shuffle(CARDS.filter(c => c.category === "cause"));
  const impacts = shuffle(CARDS.filter(c => c.category === "impact"));
  const solutions = shuffle(CARDS.filter(c => c.category === "solution"));
  const per = Math.floor(GAME_LENGTH / 3);
  const extra = GAME_LENGTH - per * 3;
  return shuffle([
    ...causes.slice(0, per),
    ...impacts.slice(0, per),
    ...solutions.slice(0, per + extra),
  ]);
};

const pointsFor = (difficulty: 1 | 2 | 3): number => {
  if (difficulty === 1) return POINTS_EASY;
  if (difficulty === 2) return POINTS_MEDIUM;
  return POINTS_HARD;
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export const ClimateGame = () => {
  type Phase = "intro" | "playing" | "feedback" | "results";

  const [phase, setPhase] = useState<Phase>("intro");
  const [deck, setDeck] = useState<ClimateCard[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [byCategory, setByCategory] = useState({ cause: 0, impact: 0, solution: 0 });
  const [lastChoice, setLastChoice] = useState<Category | null>(null);
  const [lastWasCorrect, setLastWasCorrect] = useState(false);
  const [milestoneBurst, setMilestoneBurst] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setDeck(buildDeck());
    setIndex(0);
    setScore(0);
    setStreak(0);
    setLongestStreak(0);
    setCorrectCount(0);
    setByCategory({ cause: 0, impact: 0, solution: 0 });
    setLastChoice(null);
    setLastWasCorrect(false);
    setPhase("playing");
  };

  const handleAnswer = (choice: Category) => {
    if (phase !== "playing") return;
    const card = deck[index];
    const correct = choice === card.category;
    const points = correct ? pointsFor(card.difficulty) + streak * STREAK_BONUS : 0;

    setLastChoice(choice);
    setLastWasCorrect(correct);

    if (correct) {
      const newStreak = streak + 1;
      const newScore = score + points;
      setScore(newScore);
      setStreak(newStreak);
      setLongestStreak(Math.max(longestStreak, newStreak));
      setCorrectCount(correctCount + 1);
      setByCategory({ ...byCategory, [card.category]: byCategory[card.category] + 1 });

      // Trigger a celebratory burst on milestone streaks
      if (newStreak === 3 || newStreak === 5 || newStreak === 7) {
        setMilestoneBurst(true);
        setTimeout(() => setMilestoneBurst(false), 1500);
      }
    } else {
      setStreak(0);
    }

    setPhase("feedback");
  };

  const nextCard = () => {
    if (index + 1 >= deck.length) {
      setPhase("results");
    } else {
      setIndex(index + 1);
      setPhase("playing");
    }
  };

  // Keyboard shortcuts: 1=cause, 2=impact, 3=solution, Enter=next
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase === "playing") {
        if (e.key === "1") handleAnswer("cause");
        if (e.key === "2") handleAnswer("impact");
        if (e.key === "3") handleAnswer("solution");
      } else if (phase === "feedback" && e.key === "Enter") {
        nextCard();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ============================================================
  // RENDERS
  // ============================================================

  // ---- INTRO ----
  if (phase === "intro") {
    return (
      <Card className="p-8 md:p-10 bg-white/95 backdrop-blur shadow-xl border-white/20 text-foreground">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-forest/10 p-3">
            <Target className="h-6 w-6 text-forest" />
          </div>
          <Badge variant="secondary" className="bg-forest/10 text-forest border-0">
            10 climate scenarios · 5–10 minutes
          </Badge>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-3">
          You're briefing the Premier's office.
        </h3>
        <p className="text-muted-foreground mb-6 max-w-2xl">
          Reports are coming in from across British Columbia. For each one, decide:
          is this a <span className="font-semibold text-ember">cause</span>,
          an <span className="font-semibold text-ocean">impact</span>, or
          a <span className="font-semibold text-forest">solution</span> to climate change?
          Build a streak. Earn the cabinet's trust.
        </p>
        <div className="grid grid-cols-3 gap-3 mb-7">
          <div className="rounded-xl bg-ember/10 p-4 border border-ember/20">
            <div className="text-xs font-semibold text-ember uppercase tracking-wider mb-1">Cause</div>
            <div className="text-sm text-muted-foreground">What's warming the planet?</div>
          </div>
          <div className="rounded-xl bg-ocean/10 p-4 border border-ocean/20">
            <div className="text-xs font-semibold text-ocean uppercase tracking-wider mb-1">Impact</div>
            <div className="text-sm text-muted-foreground">What's already changing?</div>
          </div>
          <div className="rounded-xl bg-forest/10 p-4 border border-forest/20">
            <div className="text-xs font-semibold text-forest uppercase tracking-wider mb-1">Solution</div>
            <div className="text-sm text-muted-foreground">What can we do?</div>
          </div>
        </div>
        <Button size="lg" onClick={startGame} className="bg-forest text-white hover:bg-forest/90">
          <Sparkles className="mr-2 h-4 w-4" /> Begin briefing
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          Tip: keyboard 1 / 2 / 3 to answer · Enter to continue
        </p>
      </Card>
    );
  }

  // ---- RESULTS ----
  if (phase === "results") {
    const pct = Math.round((correctCount / deck.length) * 100);
    let medal = "Climate Apprentice";
    let medalColor = "text-ocean";
    let blurb = "Solid start — climate systems are complex. Try the Explorer to dig deeper.";
    if (pct >= 90) {
      medal = "Climate Strategist";
      medalColor = "text-sun";
      blurb = "Outstanding. You're thinking like a climate scientist — and a policymaker. Now share what you learned with someone outside class.";
    } else if (pct >= 70) {
      medal = "Climate Analyst";
      medalColor = "text-forest";
      blurb = "Strong work. You can clearly distinguish causes, impacts, and solutions. Revisit the Explorer for the trickier ones.";
    } else if (pct >= 50) {
      medal = "Climate Trainee";
      medalColor = "text-ember";
      blurb = "Good foundation. The line between impact and cause can be tricky — review the Explorer and try again.";
    }

    return (
      <Card className="p-8 md:p-10 bg-white/95 backdrop-blur shadow-xl border-white/20 text-foreground">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-sun/15 p-3">
            <Trophy className={`h-6 w-6 ${medalColor}`} />
          </div>
          <Badge className="bg-sun/15 text-sun-foreground border-0">Briefing complete</Badge>
        </div>
        <h3 className={`text-3xl md:text-4xl font-bold mb-2 ${medalColor}`}>{medal}</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl">{blurb}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          <Stat label="Score" value={score} />
          <Stat label={`Correct / ${deck.length}`} value={correctCount} />
          <Stat label="Longest Streak" value={longestStreak} icon={<Flame className="h-4 w-4 text-ember" />} />
          <Stat label="Accuracy" value={`${pct}%`} />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-7">
          <CategoryStat color="ember" label="Causes" value={byCategory.cause} />
          <CategoryStat color="ocean" label="Impacts" value={byCategory.impact} />
          <CategoryStat color="forest" label="Solutions" value={byCategory.solution} />
        </div>

        <div className="rounded-xl bg-forest/5 border border-forest/15 p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-forest" />
            <h4 className="font-semibold text-forest">Reflect — First Peoples Principles of Learning</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Learning is holistic, reflexive, and recognizes the consequences of one's actions. Pick one card from today and ask:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
            <li>Whose story does this connect to in BC?</li>
            <li>What action — large or small — could you, your school, or your community take this month?</li>
            <li>How might that ripple out over a year? A decade? A generation?</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={startGame} className="bg-forest text-white hover:bg-forest/90">
            <RotateCcw className="mr-2 h-4 w-4" /> Play again
          </Button>
          <Button onClick={() => setPhase("intro")} variant="outline">
            Back to intro
          </Button>
        </div>
      </Card>
    );
  }

  // ---- PLAYING / FEEDBACK ----
  const card = deck[index];
  const progressPct = ((index + (phase === "feedback" ? 1 : 0)) / deck.length) * 100;

  return (
    <Card
      ref={cardRef}
      className="p-6 md:p-8 bg-white/95 backdrop-blur shadow-xl border-white/20 text-foreground relative overflow-hidden"
    >
      {/* Milestone burst */}
      {milestoneBurst && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
          <div className="animate-ping rounded-full bg-sun/30 w-32 h-32" />
          <Sparkles className="absolute h-12 w-12 text-sun animate-pulse" />
        </div>
      )}

      {/* HUD */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 rounded-full bg-forest/10 px-3 py-1.5 text-sm font-semibold text-forest">
          <Zap className="h-3.5 w-3.5" /> Score: <span className="font-bold">{score}</span>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${
          streak > 0 ? "bg-ember/15 text-ember scale-105" : "bg-muted text-muted-foreground"
        }`}>
          <Flame className="h-3.5 w-3.5" /> Streak: <span className="font-bold">{streak}</span>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          Card {index + 1} of {deck.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-forest via-ocean to-sun transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Scenario */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="bg-ocean/10 text-ocean border-0">
            <TrendingUp className="h-3 w-3 mr-1" />
            Incoming scenario
          </Badge>
          {card.difficulty === 3 && (
            <Badge variant="secondary" className="bg-ember/15 text-ember border-0">
              Tricky · {pointsFor(3)} pts
            </Badge>
          )}
          {card.difficulty === 2 && (
            <Badge variant="secondary" className="bg-sun/15 text-sun-foreground border-0">
              {pointsFor(2)} pts
            </Badge>
          )}
        </div>
        <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2">{card.title}</h3>
        <p className="text-muted-foreground">{card.description}</p>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <ChoiceButton
          label="Cause"
          tone="ember"
          subtitle="What's warming the planet?"
          onClick={() => handleAnswer("cause")}
          disabled={phase === "feedback"}
          highlight={phase === "feedback" && card.category === "cause"}
          shake={phase === "feedback" && lastChoice === "cause" && !lastWasCorrect}
        />
        <ChoiceButton
          label="Impact"
          tone="ocean"
          subtitle="What's already changing?"
          onClick={() => handleAnswer("impact")}
          disabled={phase === "feedback"}
          highlight={phase === "feedback" && card.category === "impact"}
          shake={phase === "feedback" && lastChoice === "impact" && !lastWasCorrect}
        />
        <ChoiceButton
          label="Solution"
          tone="forest"
          subtitle="What can we do?"
          onClick={() => handleAnswer("solution")}
          disabled={phase === "feedback"}
          highlight={phase === "feedback" && card.category === "solution"}
          shake={phase === "feedback" && lastChoice === "solution" && !lastWasCorrect}
        />
      </div>

      {/* Feedback */}
      {phase === "feedback" && (
        <div
          className={`rounded-xl p-5 mb-5 border-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
            lastWasCorrect
              ? "bg-forest/5 border-forest/30"
              : "bg-ember/5 border-ember/30"
          }`}
        >
          <div className="flex items-start gap-3 mb-2">
            {lastWasCorrect ? (
              <CheckCircle2 className="h-6 w-6 text-forest shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-6 w-6 text-ember shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-lg">
                {lastWasCorrect ? "Correct!" : "Not quite."} This is a{" "}
                <span className={
                  card.category === "cause" ? "text-ember"
                  : card.category === "impact" ? "text-ocean"
                  : "text-forest"
                }>{card.category}</span>.
              </h4>
              <p className="text-sm text-muted-foreground mt-1">{card.explanation}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-white/60 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="h-3.5 w-3.5 text-forest" />
                <span className="text-xs font-semibold uppercase tracking-wider text-forest">BC Connection</span>
              </div>
              <p className="text-sm text-foreground/80">{card.bcConnection}</p>
            </div>
            <div className="rounded-lg bg-white/60 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-ocean" />
                <span className="text-xs font-semibold uppercase tracking-wider text-ocean">By the numbers</span>
              </div>
              <p className="text-sm text-foreground/80 font-medium">{card.statistic}</p>
            </div>
          </div>
        </div>
      )}

      {/* Next button */}
      {phase === "feedback" && (
        <Button onClick={nextCard} className="bg-forest text-white hover:bg-forest/90" size="lg">
          {index + 1 >= deck.length ? "See your briefing results" : "Next scenario"}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </Card>
  );
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

const ChoiceButton = ({
  label,
  tone,
  subtitle,
  onClick,
  disabled,
  highlight,
  shake,
}: {
  label: string;
  tone: "ember" | "ocean" | "forest";
  subtitle: string;
  onClick: () => void;
  disabled: boolean;
  highlight: boolean;
  shake: boolean;
}) => {
  const baseTone =
    tone === "ember" ? "border-ember/30 hover:border-ember hover:bg-ember/5"
    : tone === "ocean" ? "border-ocean/30 hover:border-ocean hover:bg-ocean/5"
    : "border-forest/30 hover:border-forest hover:bg-forest/5";
  const highlightTone =
    tone === "ember" ? "border-ember bg-ember/10 ring-2 ring-ember/40"
    : tone === "ocean" ? "border-ocean bg-ocean/10 ring-2 ring-ocean/40"
    : "border-forest bg-forest/10 ring-2 ring-forest/40";
  const labelTone =
    tone === "ember" ? "text-ember"
    : tone === "ocean" ? "text-ocean"
    : "text-forest";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${
        highlight ? highlightTone : baseTone
      } ${shake ? "animate-pulse" : ""} ${
        disabled && !highlight ? "opacity-50" : ""
      } disabled:cursor-default`}
    >
      <div className={`text-lg font-bold mb-0.5 ${labelTone}`}>{label}</div>
      <div className="text-xs text-muted-foreground">{subtitle}</div>
    </button>
  );
};

const Stat = ({ label, value, icon }: { label: string; value: number | string; icon?: React.ReactNode }) => (
  <div className="rounded-xl bg-glacier/40 p-4 text-center">
    <div className="flex items-center justify-center gap-1.5 text-2xl md:text-3xl font-bold text-forest">
      {icon}
      {value}
    </div>
    <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
  </div>
);

const CategoryStat = ({ color, label, value }: { color: "ember" | "ocean" | "forest"; label: string; value: number }) => {
  const colorClass =
    color === "ember" ? "text-ember bg-ember/10 border-ember/20"
    : color === "ocean" ? "text-ocean bg-ocean/10 border-ocean/20"
    : "text-forest bg-forest/10 border-forest/20";
  return (
    <div className={`rounded-xl border ${colorClass} p-4 text-center`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs uppercase tracking-wider mt-1 opacity-80">{label}</div>
    </div>
  );
};
