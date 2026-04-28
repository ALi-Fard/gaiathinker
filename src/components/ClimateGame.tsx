import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, RotateCcw, Trophy, Sparkles } from "lucide-react";

type Bin = "cause" | "impact" | "solution";

type GameCard = {
  id: string;
  text: string;
  answer: Bin;
  why: string;
};

const DECK: GameCard[] = [
  { id: "1", text: "Burning gasoline in a pickup truck", answer: "cause", why: "Combustion releases CO₂ — transportation is BC's #1 emissions source." },
  { id: "2", text: "619 deaths during the 2021 BC heat dome", answer: "impact", why: "Extreme heat events are now more frequent due to a warming climate." },
  { id: "3", text: "Installing a heat pump instead of a gas furnace", answer: "solution", why: "Heat pumps run on BC's clean hydro electricity — a major emissions cut." },
  { id: "4", text: "Methane from cattle in the Fraser Valley", answer: "cause", why: "Methane is ~80× more potent than CO₂ over 20 years." },
  { id: "5", text: "Sockeye salmon runs collapsing in the Fraser", answer: "impact", why: "Warmer rivers reduce salmon survival — a cultural and ecological loss." },
  { id: "6", text: "Riding the SkyTrain to school", answer: "solution", why: "Public transit cuts per-person emissions dramatically vs. driving." },
  { id: "7", text: "Clear-cutting old-growth forest", answer: "cause", why: "Releases stored carbon and removes a long-term carbon sink." },
  { id: "8", text: "Glaciers in the Coast Mountains shrinking 25%", answer: "impact", why: "Less glacier melt means less summer water for rivers and farms." },
  { id: "9", text: "New West's Seven Bold Steps climate plan", answer: "solution", why: "Local policy is one of the highest-leverage climate actions." },
  { id: "10", text: "Wildfire smoke days tripling since 2010", answer: "impact", why: "Hotter, drier summers fuel longer and more intense fire seasons." },
  { id: "11", text: "Eating more plant-based meals at school", answer: "solution", why: "Plant-forward diets have a much lower carbon footprint." },
  { id: "12", text: "Exporting coal through Roberts Bank terminal", answer: "cause", why: "Burned coal abroad still adds CO₂ to the shared atmosphere." },
];

const BINS: { key: Bin; label: string; tone: string; ring: string }[] = [
  { key: "cause", label: "Cause", tone: "bg-ember/10 border-ember text-ember", ring: "ring-ember" },
  { key: "impact", label: "Impact", tone: "bg-ocean/10 border-ocean text-ocean", ring: "ring-ocean" },
  { key: "solution", label: "Solution", tone: "bg-forest/10 border-forest text-forest", ring: "ring-forest" },
];

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

export const ClimateGame = () => {
  const [deck, setDeck] = useState<GameCard[]>(() => shuffle(DECK));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; why: string } | null>(null);

  const current = deck[index];
  const finished = index >= deck.length;
  const progress = useMemo(() => Math.round((index / deck.length) * 100), [index, deck.length]);

  const handleGuess = (bin: Bin) => {
    if (!current || feedback) return;
    const correct = bin === current.answer;
    if (correct) {
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    setFeedback({ correct, why: current.why });
  };

  const next = () => {
    setFeedback(null);
    setIndex((i) => i + 1);
  };

  const reset = () => {
    setDeck(shuffle(DECK));
    setIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
  };

  if (finished) {
    const stars = score >= 200 ? 3 : score >= 140 ? 2 : 1;
    return (
      <Card className="p-8 md:p-12 bg-gradient-card shadow-glow text-center">
        <Trophy className="h-14 w-14 text-sun mx-auto mb-4" />
        <h3 className="text-3xl md:text-4xl font-bold mb-2">Game complete!</h3>
        <p className="text-muted-foreground mb-6">You sorted all {deck.length} cards.</p>
        <div className="flex justify-center gap-8 mb-8 flex-wrap">
          <div>
            <div className="text-4xl font-bold text-ocean">{score}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Final score</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-ember">{bestStreak}🔥</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Best streak</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-forest">{"⭐".repeat(stars)}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Climate Thinker rating</div>
          </div>
        </div>
        <Button onClick={reset} size="lg" className="bg-forest text-forest-foreground hover:bg-forest/90">
          <RotateCcw className="mr-2 h-4 w-4" /> Play again
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8 bg-gradient-card shadow-glow">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-4 text-sm">
          <Badge variant="secondary" className="text-base px-3 py-1">Score: <span className="ml-1 font-bold">{score}</span></Badge>
          {streak > 1 && (
            <Badge className="bg-ember text-ember-foreground text-base px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> {streak}× streak
            </Badge>
          )}
        </div>
        <span className="text-sm text-muted-foreground">Card {index + 1} of {deck.length}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-8">
        <div className="h-full bg-gradient-hero transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Card */}
      <div className="bg-foreground text-background rounded-2xl p-8 md:p-12 mb-6 text-center min-h-[160px] flex items-center justify-center shadow-soft">
        <p className="text-xl md:text-2xl font-medium leading-snug">{current.text}</p>
      </div>

      {/* Bins / answer buttons */}
      <p className="text-center text-sm text-muted-foreground mb-3">Is this a cause, impact, or solution?</p>
      <div className="grid grid-cols-3 gap-3">
        {BINS.map((b) => {
          const isAnswer = feedback && b.key === current.answer;
          return (
            <button
              key={b.key}
              onClick={() => handleGuess(b.key)}
              disabled={!!feedback}
              className={`rounded-xl border-2 p-4 font-semibold transition-all duration-200 ${b.tone} ${
                isAnswer ? `ring-4 ${b.ring}` : ""
              } ${feedback ? "cursor-default" : "hover:scale-105 hover:shadow-soft"}`}
            >
              {b.label}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`mt-6 rounded-xl p-5 animate-in fade-in slide-in-from-bottom-2 ${
            feedback.correct ? "bg-forest/10 border border-forest/30" : "bg-ember/10 border border-ember/30"
          }`}
        >
          <div className="flex items-start gap-3">
            {feedback.correct ? (
              <CheckCircle2 className="h-6 w-6 text-forest shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-6 w-6 text-ember shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-semibold mb-1">
                {feedback.correct ? `Correct! +${10 + (streak - 1) * 2} pts` : `Not quite — it's a ${current.answer}.`}
              </p>
              <p className="text-sm text-muted-foreground">{feedback.why}</p>
            </div>
          </div>
          <Button onClick={next} className="mt-4 w-full bg-foreground text-background hover:bg-foreground/90">
            Next card →
          </Button>
        </div>
      )}
    </Card>
  );
};
