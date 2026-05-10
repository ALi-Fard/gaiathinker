// ============================================================
// ClimateExplorer.tsx
// GaiaThinker: Climate Cards Explorer (BC-grounded)
// ------------------------------------------------------------
// Drop this file into: src/components/ClimateExplorer.tsx
// Replaces your existing ClimateExplorer component.
// Same shared card data as ClimateGame for consistency.
// ============================================================

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  TrendingUp,
  CheckCircle2,
  Flame,
  Waves,
  Sprout,
  ArrowRight,
  X,
} from "lucide-react";

// Re-declared here for portability; in larger codebase you'd
// extract this into a shared `src/data/climateCards.ts` file.
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
  // CAUSES
  { id: "c-gasoline", title: "Gasoline-powered commutes across Metro Vancouver", description: "Cars and trucks burning gasoline release CO₂ into the atmosphere.", category: "cause", bcConnection: "Transportation is BC's #1 source of greenhouse-gas emissions.", explanation: "Tailpipe emissions are a primary driver of climate change. This is why CleanBC prioritizes electric vehicles and transit expansion.", statistic: "≈40% of BC's emissions come from transportation", difficulty: 1 },
  { id: "c-natgas", title: "Expanding LNG extraction and export from Kitimat", description: "Producing and shipping liquefied natural gas releases CO₂ and methane leaks.", category: "cause", bcConnection: "LNG Canada in Kitimat is one of the largest industrial emissions sources in BC.", explanation: "Even though natural gas burns cleaner than coal, methane leaks across the supply chain make its full climate footprint significant.", statistic: "Methane traps 80× more heat than CO₂ over 20 years", difficulty: 2 },
  { id: "c-deforestation", title: "Clear-cut logging of old-growth coastal forests", description: "Cutting forests releases stored carbon and removes a long-term carbon sink.", category: "cause", bcConnection: "Old-growth on Vancouver Island and the Central Coast holds some of Earth's densest carbon stores.", explanation: "Forests pull CO₂ from the air and store it in wood and soil. When cleared faster than they regrow, that carbon returns to the atmosphere.", statistic: "BC's old-growth forests store ≈1,000 tonnes carbon per hectare", difficulty: 1 },
  { id: "c-methane-livestock", title: "Methane from Fraser Valley dairy operations", description: "Cattle digestion and waste decomposition release methane, a potent greenhouse gas.", category: "cause", bcConnection: "BC's dairy industry is concentrated in the Fraser Valley near Abbotsford and Chilliwack.", explanation: "Methane is a short-lived but powerful greenhouse gas. Reducing it is one of the fastest ways to slow near-term warming.", statistic: "Agriculture: ≈6% of BC emissions", difficulty: 2 },
  { id: "c-cement", title: "Producing cement for Metro Vancouver construction", description: "Cement manufacturing emits CO₂ from both fuel use and chemical reactions.", category: "cause", bcConnection: "Lafarge's Richmond plant supplies much of the region's concrete.", explanation: "Cement alone accounts for roughly 7–8% of global emissions, making low-carbon concrete a major climate frontier.", statistic: "Global cement: ≈8% of all CO₂ emissions", difficulty: 3 },
  // IMPACTS
  { id: "i-heatdome", title: "The 2021 heat dome killing hundreds of British Columbians", description: "A record-shattering heat wave pushed Lytton to 49.6°C before the village burned the next day.", category: "impact", bcConnection: "BC's deadliest weather disaster killed 619 people — most in their homes without air conditioning.", explanation: "Climate scientists determined this heat dome was virtually impossible without human-caused warming. It's a consequence, not a cause.", statistic: "619 deaths · Lytton hit 49.6°C", difficulty: 1 },
  { id: "i-wildfire-smoke", title: "Wildfire smoke days tripling since 2010", description: "BC residents now breathe wildfire smoke for weeks each summer, harming lungs and hearts.", category: "impact", bcConnection: "Kamloops, Kelowna, and even coastal cities like New Westminster regularly issue air-quality advisories.", explanation: "Hotter, drier summers extend fire seasons and intensify smoke — a clear downstream impact.", statistic: "2023: 28,000+ km² burned in BC — a record", difficulty: 1 },
  { id: "i-salmon", title: "Fraser River sockeye runs collapsing", description: "Warmer rivers stress salmon, and recent runs have been the smallest on record.", category: "impact", bcConnection: "The Big Bar landslide and warming Fraser temperatures devastated sockeye — a crisis for First Nations.", explanation: "Salmon need cold, oxygen-rich water. Climate-driven heat pushes river temperatures past lethal thresholds.", statistic: "2020 sockeye return: 290,000 (vs. 4M+ historic)", difficulty: 1 },
  { id: "i-shellfish", title: "Pacific shellfish dying from ocean acidification", description: "Oceans absorb CO₂ and become more acidic, dissolving the shells of young oysters and clams.", category: "impact", bcConnection: "Baynes Sound near Comox — where most of BC's oysters are farmed — has seen repeated mass die-offs.", explanation: "Ocean acidification is a measured chemical impact of higher atmospheric CO₂, hitting shellfish hardest.", statistic: "Ocean pH has dropped ≈0.1 since pre-industrial — a 26% rise in acidity", difficulty: 2 },
  { id: "i-sealevel", title: "Sea-level rise threatening New Westminster's waterfront", description: "Higher seas combine with king tides and storm surges to flood riverfront communities.", category: "impact", bcConnection: "New Westminster and Richmond are upgrading dikes for projected 1m+ sea-level rise by 2100.", explanation: "Sea-level rise from melting ice and warming oceans is a direct, observable impact along BC's coast.", statistic: "BC projection: up to 1m sea-level rise by 2100", difficulty: 1 },
  { id: "i-glacier", title: "Coast Mountain glaciers retreating rapidly", description: "BC's glaciers are shrinking, threatening summer water supplies for rivers and farms.", category: "impact", bcConnection: "The Place Glacier near Pemberton has lost over 20% of its mass since the 1980s.", explanation: "Glacier melt is one of the most visible long-term impacts of sustained warming.", statistic: "Western Canadian glaciers: 70% mass loss projected by 2100", difficulty: 2 },
  { id: "i-pinebeetle", title: "Mountain pine beetle decimating interior forests", description: "Warmer winters let beetles survive and explode in numbers, killing vast stands of pine.", category: "impact", bcConnection: "BC's interior lost about half its merchantable lodgepole pine since the late 1990s.", explanation: "Cold winters used to kill beetles. Climate change removed that natural check — a cascading impact.", statistic: "≈18 million hectares of BC forest affected", difficulty: 3 },
  // SOLUTIONS
  { id: "s-heatpump", title: "Switching home heating from gas to electric heat pumps", description: "Heat pumps use electricity to move heat efficiently — in BC, that electricity is mostly clean.", category: "solution", bcConnection: "BC and federal CleanBC rebates can cover thousands of dollars of a heat-pump install.", explanation: "Replacing gas furnaces with heat pumps is one of the highest-impact household climate actions in BC.", statistic: "Heat pumps cut home heating emissions by ≈75%", difficulty: 1 },
  { id: "s-transit", title: "Expanding SkyTrain and electric bus networks", description: "Public transit moves more people per unit of energy and cuts tailpipe emissions.", category: "solution", bcConnection: "The Surrey-Langley SkyTrain extension and electric bus rollout are flagship low-carbon projects.", explanation: "Shifting trips from cars to electric transit is a classic, evidence-based mitigation solution.", statistic: "TransLink moves 1M+ trips per day on clean electricity", difficulty: 1 },
  { id: "s-indigenous", title: "Indigenous-led Guardian stewardship programs", description: "Coastal Guardian Watchmen monitor ecosystems using traditional knowledge and modern science.", category: "solution", bcConnection: "The Coastal Guardian Watchmen on BC's Central and North Coasts protect forests, salmon, and shorelines.", explanation: "Indigenous-led stewardship consistently produces better biodiversity and carbon outcomes — a solution rooted in millennia of knowledge.", statistic: "Indigenous-managed lands hold ≈80% of global biodiversity", difficulty: 2 },
  { id: "s-oldgrowth", title: "Protecting at-risk old-growth forests", description: "Standing old-growth stores enormous carbon and supports biodiversity.", category: "solution", bcConnection: "Fairy Creek and the Great Bear Rainforest are high-profile examples of old-growth protection in BC.", explanation: "Avoided deforestation is one of the fastest, cheapest climate solutions available.", statistic: "BC pledged to defer logging on 2.6M ha of at-risk old-growth", difficulty: 2 },
  { id: "s-renewables", title: "Building wind and run-of-river power", description: "Renewable electricity displaces fossil generation and supports electrification.", category: "solution", bcConnection: "BC Hydro's 2024 call for new wind power and Kwoiek Creek (a Kanaka Bar Indian Band partnership) show the range of options.", explanation: "Adding clean electricity is foundational to almost every other climate solution.", statistic: "BC's grid: ≈98% renewable already (hydro-dominated)", difficulty: 2 },
  { id: "s-active", title: "Walking, cycling, and rolling to school", description: "Active transportation cuts emissions and improves student health and focus.", category: "solution", bcConnection: "New Westminster's Agnes Greenway and protected bike lanes connect schools to neighbourhoods car-free.", explanation: "Even small daily choices add up — especially when paired with safer infrastructure.", statistic: "Cycling = ≈21× less CO₂ per km than driving", difficulty: 1 },
  { id: "s-flood", title: "Restoring wetlands and building 'living dikes'", description: "Combining engineered dikes with restored wetlands protects communities from flooding.", category: "solution", bcConnection: "After the 2021 atmospheric river flooded Sumas Prairie, BC began investing in living-dike approaches at Boundary Bay.", explanation: "Adaptation is also a solution — it reduces the harm from impacts already locked in.", statistic: "2021 Sumas flood damage: $1B+ in losses", difficulty: 3 },
  { id: "s-localfood", title: "Eating more local, plant-rich foods", description: "Shifting diets toward plants and local produce lowers food-system emissions.", category: "solution", bcConnection: "Fraser Valley farms supply Metro Vancouver schools and farmers' markets year-round.", explanation: "Food choices won't solve climate change alone, but plant-rich diets are among the most accessible personal solutions.", statistic: "Food: ≈26% of global emissions; ≈80% of that is animal-source", difficulty: 2 },
];

// ============================================================
// COMPONENT
// ============================================================
export const ClimateExplorer = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("cause");
  const [exploredIds, setExploredIds] = useState<Set<string>>(new Set());
  const [openCard, setOpenCard] = useState<ClimateCard | null>(null);

  const filtered = useMemo(
    () => CARDS.filter(c => c.category === activeCategory),
    [activeCategory]
  );

  const handleOpen = (card: ClimateCard) => {
    setOpenCard(card);
    setExploredIds(prev => new Set(prev).add(card.id));
  };

  const tabs: { key: Category; label: string; icon: typeof Flame; tone: string; bg: string }[] = [
    { key: "cause",    label: "Causes",    icon: Flame,  tone: "text-ember",  bg: "bg-ember/10 border-ember/30"   },
    { key: "impact",   label: "Impacts",   icon: Waves,  tone: "text-ocean",  bg: "bg-ocean/10 border-ocean/30"   },
    { key: "solution", label: "Solutions", icon: Sprout, tone: "text-forest", bg: "bg-forest/10 border-forest/30" },
  ];

  return (
    <div className="space-y-6">
      {/* Tracker */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {tabs.map(({ key, label, icon: Icon, tone, bg }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border-2 transition-all ${
                activeCategory === key
                  ? `${bg} ${tone} scale-105`
                  : "bg-white/60 text-muted-foreground border-transparent hover:border-muted"
              }`}
              aria-pressed={activeCategory === key}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
        <Badge variant="secondary" className="bg-forest/10 text-forest border-0">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
          Explored {exploredIds.size} / {CARDS.length}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-ember via-ocean to-forest transition-all duration-500"
          style={{ width: `${(exploredIds.size / CARDS.length) * 100}%` }}
        />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(card => {
          const explored = exploredIds.has(card.id);
          return (
            <button
              key={card.id}
              onClick={() => handleOpen(card)}
              className={`group text-left rounded-xl border-2 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                explored
                  ? "bg-forest/5 border-forest/30"
                  : "bg-white border-border hover:border-forest/30"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <Badge
                  variant="secondary"
                  className={
                    card.category === "cause" ? "bg-ember/10 text-ember border-0"
                    : card.category === "impact" ? "bg-ocean/10 text-ocean border-0"
                    : "bg-forest/10 text-forest border-0"
                  }
                >
                  {card.category === "cause" ? "Cause" : card.category === "impact" ? "Impact" : "Solution"}
                </Badge>
                {explored && <CheckCircle2 className="h-4 w-4 text-forest" />}
              </div>
              <h4 className="font-bold text-base mb-2 leading-snug group-hover:text-forest transition-colors">
                {card.title}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="italic line-clamp-1">{card.bcConnection.split(".")[0]}</span>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs font-medium text-forest opacity-0 group-hover:opacity-100 transition-opacity">
                Open card <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail modal */}
      {openCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setOpenCard(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[85vh] overflow-auto p-6 md:p-8 relative animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenCard(null)}
              className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <Badge
              variant="secondary"
              className={
                openCard.category === "cause" ? "bg-ember/10 text-ember border-0"
                : openCard.category === "impact" ? "bg-ocean/10 text-ocean border-0"
                : "bg-forest/10 text-forest border-0"
              }
            >
              {openCard.category === "cause" ? "Cause" : openCard.category === "impact" ? "Impact" : "Solution"}
            </Badge>

            <h3 className="text-2xl md:text-3xl font-bold mt-3 mb-3">{openCard.title}</h3>
            <p className="text-muted-foreground mb-5">{openCard.description}</p>

            <div className="rounded-xl bg-forest/5 border border-forest/20 p-5 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-forest" />
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  British Columbia connection
                </span>
              </div>
              <p className="text-sm text-foreground/85">{openCard.bcConnection}</p>
            </div>

            <div className="rounded-xl bg-ocean/5 border border-ocean/20 p-5 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-ocean" />
                <span className="text-xs font-bold uppercase tracking-wider text-ocean">
                  Why it matters
                </span>
              </div>
              <p className="text-sm text-foreground/85">{openCard.explanation}</p>
            </div>

            <div className="rounded-xl bg-sun/10 border border-sun/30 p-5 mb-5">
              <div className="text-xs font-bold uppercase tracking-wider text-sun-foreground mb-1">
                By the numbers
              </div>
              <p className="text-lg font-bold text-foreground">{openCard.statistic}</p>
            </div>

            <Button onClick={() => setOpenCard(null)} className="bg-forest text-white hover:bg-forest/90 w-full sm:w-auto">
              Got it
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};
