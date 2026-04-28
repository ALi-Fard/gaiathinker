import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Factory, Trees, Car, Beef, Flame, Waves, Fish, Mountain, Wind, Sprout, Bike, Sun, HomeIcon, Vote, type LucideIcon } from "lucide-react";

type Category = "causes" | "impacts" | "solutions";

type Item = {
  id: string;
  title: string;
  blurb: string;
  bcContext: string;
  icon: LucideIcon;
};

const DATA: Record<Category, Item[]> = {
  causes: [
    { id: "fossil", title: "Burning fossil fuels", blurb: "CO₂ from coal, oil, and gas traps heat in the atmosphere.", bcContext: "BC exports coal and LNG; provincial emissions are tracked annually by the Climate Change Accountability Report.", icon: Factory },
    { id: "transport", title: "Transportation", blurb: "Cars, trucks, and ships are major emitters in urban regions.", bcContext: "Transportation is the largest source of GHG emissions in BC (~40%).", icon: Car },
    { id: "deforest", title: "Deforestation & wildfires", blurb: "Lost forests release stored carbon and reduce future absorption.", bcContext: "BC's record 2023 wildfire season released more carbon than the rest of the economy combined.", icon: Flame },
    { id: "agri", title: "Industrial agriculture", blurb: "Livestock and fertilizers release methane and nitrous oxide.", bcContext: "The Fraser Valley is a key agricultural emissions hotspot in BC.", icon: Beef },
  ],
  impacts: [
    { id: "ocean", title: "Ocean warming & acidification", blurb: "Warmer, more acidic seas stress marine ecosystems.", bcContext: "Salish Sea shellfish hatcheries have already adapted operations due to acidification.", icon: Waves },
    { id: "salmon", title: "Salmon decline", blurb: "Warmer rivers reduce salmon survival and spawning success.", bcContext: "Pacific salmon runs in the Fraser River are declining — a cultural and ecological crisis for BC First Nations.", icon: Fish },
    { id: "glacier", title: "Glacier loss", blurb: "Shrinking glaciers reduce summer water supply.", bcContext: "BC's glaciers have lost ~25% of their area since the 1980s.", icon: Mountain },
    { id: "heat", title: "Heat domes & wildfire smoke", blurb: "Extreme heat events become more frequent and deadly.", bcContext: "The 2021 BC heat dome killed 619 people — the deadliest weather event in Canadian history.", icon: Sun },
  ],
  solutions: [
    { id: "renew", title: "Renewable energy", blurb: "Replace fossil fuels with wind, solar, and clean hydro.", bcContext: "BC Hydro provides ~98% renewable electricity — a strong foundation to electrify everything else.", icon: Wind },
    { id: "transit", title: "Active & public transit", blurb: "Walk, bike, and ride transit to cut transportation emissions.", bcContext: "TransLink expansions and New West's Greenway network make low-carbon travel easier.", icon: Bike },
    { id: "forest", title: "Protect & restore forests", blurb: "Healthy forests pull CO₂ from the atmosphere.", bcContext: "Old-growth deferrals and Indigenous-led stewardship protect BC carbon sinks.", icon: Trees },
    { id: "food", title: "Lower-carbon food", blurb: "Eat more plants, reduce waste, buy local.", bcContext: "School food programs across SD40 are exploring local, plant-forward menus.", icon: Sprout },
    { id: "homes", title: "Efficient buildings", blurb: "Heat pumps and insulation cut home emissions.", bcContext: "BC's Step Code drives net-zero-ready new construction by 2032.", icon: HomeIcon },
    { id: "voice", title: "Civic action", blurb: "Vote, advocate, and engage with local climate plans.", bcContext: "New Westminster declared a climate emergency in 2019 with seven Bold Steps.", icon: Vote },
  ],
};

const TABS: { key: Category; label: string; tone: string }[] = [
  { key: "causes", label: "Causes", tone: "bg-ember text-ember-foreground" },
  { key: "impacts", label: "Impacts", tone: "bg-ocean text-ocean-foreground" },
  { key: "solutions", label: "Solutions", tone: "bg-forest text-forest-foreground" },
];

export const ClimateExplorer = () => {
  const [tab, setTab] = useState<Category>("causes");
  const [openId, setOpenId] = useState<string | null>(null);
  const [explored, setExplored] = useState<Set<string>>(new Set());

  const items = DATA[tab];
  const total = useMemo(() => Object.values(DATA).flat().length, []);
  const progress = Math.round((explored.size / total) * 100);

  const handleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
    setExplored((prev) => new Set(prev).add(id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Button
              key={t.key}
              onClick={() => { setTab(t.key); setOpenId(null); }}
              variant={tab === t.key ? "default" : "outline"}
              className={tab === t.key ? t.tone : ""}
            >
              {t.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Explored {explored.size} / {total}</span>
          <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-hero transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isOpen = openId === item.id;
          return (
            <Card
              key={item.id}
              onClick={() => handleOpen(item.id)}
              className={`cursor-pointer p-5 bg-gradient-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow ${isOpen ? "ring-2 ring-ocean shadow-glow" : "shadow-soft"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-xl p-2.5 ${TABS.find(t => t.key === tab)?.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg leading-tight">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.blurb}</p>
                </div>
              </div>
              {isOpen && (
                <div className="mt-4 rounded-lg border border-border bg-glacier/40 p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Badge variant="secondary" className="mb-2">BC connection</Badge>
                  <p className="text-sm text-glacier-foreground">{item.bcContext}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
