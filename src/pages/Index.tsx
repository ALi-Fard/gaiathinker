import heroImg from "@/assets/bc-landscape.jpg";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClimateExplorer } from "@/components/ClimateExplorer";
import { ClimateGame } from "@/components/ClimateGame";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { BookOpen, Target, Users, Leaf, MapPin, ClipboardCheck, Lightbulb, Globe2, Gamepad2, Sprout, Music } from "lucide-react";
import { useState, useRef } from "react";

const LYRICS: { time: number; text: string }[] = [
  { time: 13, text: "Morning light through the cedar trees," },
  { time: 17, text: "Breathing in the quiet, gentle breeze." },
  { time: 21, text: "Footsteps soft on the forest floor," },
  { time: 25, text: "Finding what this world is calling for." },
  { time: 39, text: "Every choice we make becomes a seed," },
  { time: 43, text: "Growing into what the future needs." },
  { time: 48, text: "We rise together, hand in hand," },
  { time: 52, text: "Guardians of this living land." },
  { time: 56, text: "Every voice, every spark, every hope we bring," },
  { time: 60, text: "Helps the Earth begin to sing." },
  { time: 66, text: "Rivers carry stories from long ago," },
  { time: 70, text: "Mountains shine in a golden glow." },
  { time: 74, text: "We're the ones who shape the way," },
  { time: 78, text: "Writing what tomorrow's gonna say." },
  { time: 84, text: "We rise together, hand in hand," },
  { time: 88, text: "Guardians of this living land." },
  { time: 92, text: "Every voice, every spark, every hope we bring," },
  { time: 96, text: "Helps the Earth begin to sing." },
  { time: 102, text: "Step by step, we learn and grow —" },
  { time: 106, text: "This is our home, and it shows." },
];

const ClimateMusicButton = () => {
  const [playing, setPlaying] = useState(false);
  const [line, setLine] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const start = () => {
    setLine("");
    setPlaying(true);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const current = e.currentTarget.currentTime;
    const active = LYRICS.filter((l) => l.time <= current).pop();
    const text = active?.text ?? "";
    setLine((prev) => (prev === text ? prev : text));
  };

  return (
    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
      <Button size="lg" onClick={start} className="bg-ember text-ember-foreground hover:bg-ember/90">
        <Music className="mr-2 h-4 w-4" /> Generate Climate Music
      </Button>
      {playing && (
        <>
          <audio
            ref={audioRef}
            src="/cedar-sunrise.mp3"
            controls
            autoPlay
            className="mt-1"
            onTimeUpdate={handleTimeUpdate}
          />
          <div className="w-full sm:w-[28rem] min-h-[3.5rem] flex items-center justify-center text-center px-4">
            <p
              key={line}
              className="animate-fade-in font-medium"
              style={{
                color: "#E6C200",
                fontSize: "1.4rem",
                textAlign: "center",
                transition: "opacity 0.6s ease",
              }}
            >
              {line}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const Section = ({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="py-16 md:py-24">
    <div className="container max-w-6xl">
      <p className="text-sm font-medium uppercase tracking-widest text-ocean mb-3">{eyebrow}</p>
      <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8 max-w-3xl">{title}</h2>
      {children}
    </div>
  </section>
);

const Index = () => {
  return (
    <main className="min-h-screen">
      {/* Top brand nav */}
      <nav className="absolute top-0 left-0 right-0 z-20">
        <div className="container max-w-6xl flex items-center justify-between py-5 text-white">
          <a href="#" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur border border-white/20">
              <Sprout className="h-5 w-5" />
            </span>
            <span>GaiaThinker</span>
          </a>
          <div className="hidden sm:flex items-center gap-6 text-sm text-white/80">
            <a href="#explorer" className="hover:text-white transition">Explorer</a>
            <a href="#game" className="hover:text-white transition">Game</a>
            <a href="#goals" className="hover:text-white transition">Educators</a>
            <a href="https://gaialink.ca" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">gaialink.ca ↗</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Misty British Columbia coastal forest at sunrise"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-forest/85 via-ocean/70 to-forest/40" />
        <div className="relative container max-w-6xl pt-32 pb-24 md:pt-40 md:pb-36 text-white">
          <Badge className="bg-white/15 hover:bg-white/15 text-white backdrop-blur border-white/20 mb-6">
            <MapPin className="h-3.5 w-3.5 mr-1.5" /> GaiaThinker · New Westminster SD · Grades 9–12
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] max-w-4xl">
            Our Changing Climate: A British Columbia Story
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl text-white/90">
            An interactive secondary science lesson and game exploring the causes, impacts, and solutions to climate change — grounded in the places, people, and ecosystems of BC.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="bg-white text-forest hover:bg-white/90" asChild>
              <a href="#explorer">Start the Activity</a>
            </Button>
            <Button size="lg" className="bg-sun text-sun-foreground hover:bg-sun/90" asChild>
              <a href="/gaiathinker-3d.html" target="_blank" rel="noopener noreferrer"><Gamepad2 className="mr-2 h-4 w-4" /> Play the Game</a>
            </Button>
            <ClimateMusicButton />
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/80">
            <span>⏱ 75–90 minutes</span>
            <span>👥 Individual or small groups</span>
            <span>📚 Cross-curricular: Science, Social Studies, Earth Science</span>
          </div>
        </div>
      </header>

      {/* Learning Goals */}
      <Section id="goals" eyebrow="Learning Goals" title="What students will know, do, and understand">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: BookOpen, title: "Know", text: "The greenhouse effect, key drivers of climate change, and how scientists measure it.", tone: "bg-ocean text-ocean-foreground" },
            { icon: Target, title: "Do", text: "Investigate local BC climate impacts and evaluate evidence-based solutions.", tone: "bg-ember text-ember-foreground" },
            { icon: Lightbulb, title: "Understand", text: "Climate action is rooted in science, Indigenous knowledge, and community choices.", tone: "bg-forest text-forest-foreground" },
          ].map(({ icon: Icon, title, text, tone }) => (
            <Card key={title} className="p-6 bg-gradient-card shadow-soft">
              <div className={`inline-flex rounded-xl p-3 ${tone} mb-4`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">{text}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Curriculum Connections */}
      <section className="bg-glacier/40 py-16 md:py-24 border-y border-border">
        <div className="container max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-widest text-ocean mb-3">BC Curriculum Connections</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-10 max-w-3xl">Aligned with the BC K–12 curriculum</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { course: "Science 9", big: "The biosphere, geosphere, hydrosphere and atmosphere are interconnected systems.", curricular: "Evaluate the validity and limitations of a model; analyze cause-and-effect relationships." },
              { course: "Science 10", big: "Energy is conserved and its transformation can affect living things and the environment.", curricular: "Investigate the carbon cycle and the impacts of human activity on Earth systems." },
              { course: "Environmental Science 11", big: "Human activities cause changes in the local and global environment.", curricular: "Analyze ecosystems and human impacts; design solutions to environmental problems." },
              { course: "Environmental Science 12", big: "Sustainable land use is essential to the well-being of all species.", curricular: "Evaluate Indigenous land stewardship and the role of policy in mitigating climate change." },
              { course: "Earth Sciences 11", big: "Earth materials and processes are influenced by, and influence, biological systems.", curricular: "Examine evidence of climate change in the geological record and present day." },
              { course: "Social Studies 10", big: "Worldviews lead to different perspectives and ideas about development.", curricular: "Assess environmental, political, and economic policies in Canada." },
            ].map((c) => (
              <Card key={c.course} className="p-6 bg-card shadow-soft border-l-4 border-l-forest">
                <Badge className="bg-forest text-forest-foreground mb-3">{c.course}</Badge>
                <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Big Idea:</span> {c.big}</p>
                <p className="text-sm text-muted-foreground mt-2"><span className="font-semibold text-foreground">Curricular Competency:</span> {c.curricular}</p>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground italic">
            First Peoples Principles of Learning are woven throughout — particularly that learning is holistic, reflexive, and involves recognizing the consequences of one's actions.
          </p>
        </div>
      </section>

      {/* Interactive Explorer */}
      <Section id="explorer" eyebrow="Interactive Activity" title="Explore the climate system: causes, impacts & solutions">
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
          Click each card to reveal a BC-specific connection. Your goal is to explore all three categories and complete your tracker.
        </p>
        <ClimateExplorer />
      </Section>

      {/* Game */}
      <section id="game" className="bg-gradient-hero py-16 md:py-24 text-white">
        <div className="container max-w-5xl">
          <Badge className="bg-white/15 hover:bg-white/15 text-white backdrop-blur border-white/20 mb-4">
            <Gamepad2 className="h-3.5 w-3.5 mr-1.5" /> GaiaThinker Game
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl">Sort it out: Cause, Impact, or Solution?</h2>
          <p className="text-lg text-white/85 mb-10 max-w-2xl">
            Read each real-world climate scenario and decide which category it belongs to. Build streaks, earn points, and learn the why behind every answer.
          </p>
          <ClimateGame />
        </div>
      </section>

      {/* Lesson Activities */}
      <section className="bg-foreground text-background py-16 md:py-24">
        <div className="container max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-widest text-sun mb-3">Lesson Sequence</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-10 max-w-3xl">A 75–90 minute student journey</h2>
          <div className="grid gap-4">
            {[
              { time: "10 min", title: "Hook: The 2021 Heat Dome", icon: Globe2, body: "Show a 2-minute clip of the BC heat dome. Students journal: 'Where were you? What did you notice?' Connect personal experience to global trends." },
              { time: "15 min", title: "Mini-lesson: The Greenhouse Effect", icon: BookOpen, body: "Use the PhET Greenhouse Effect simulation. Students sketch the energy flow diagram and define key terms (radiative forcing, ppm, feedback loop)." },
              { time: "25 min", title: "Interactive Explorer (above)", icon: Target, body: "Students work individually or in pairs through the Causes → Impacts → Solutions cards, completing a tracker organizer." },
              { time: "20 min", title: "Place-based investigation", icon: MapPin, body: "Small groups research one local impact (Fraser River salmon, Pacific shellfish, wildfire smoke days, sea-level rise in New West) and report back jigsaw-style." },
              { time: "15 min", title: "Solutions pitch", icon: Leaf, body: "Each group proposes one action New Westminster could take. Vote as a class. Connect to the City's Bold Steps climate plan." },
              { time: "5 min", title: "Exit ticket", icon: ClipboardCheck, body: "One sentence: 'My most important takeaway is…' One question: 'I still wonder…'" },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <Card key={i} className="p-5 bg-background/5 backdrop-blur border-background/10 text-background flex gap-4 items-start">
                  <div className="hidden sm:flex flex-col items-center min-w-[70px]">
                    <span className="text-2xl font-bold text-sun">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-xs text-background/60 mt-1">{step.time}</span>
                  </div>
                  <div className="rounded-xl p-3 bg-sun/15 text-sun">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <Badge variant="secondary" className="sm:hidden">{step.time}</Badge>
                    </div>
                    <p className="text-background/80 text-sm">{step.body}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Assessment & Differentiation */}
      <Section id="assessment" eyebrow="Assessment & Inclusion" title="Formative assessment with multiple entry points">
        <div className="grid md:grid-cols-2 gap-5">
          <Card className="p-6 bg-gradient-card shadow-soft">
            <Users className="h-6 w-6 text-ocean mb-3" />
            <h3 className="text-xl font-semibold mb-3">Differentiation</h3>
            <ul className="space-y-2 text-muted-foreground text-sm list-disc pl-5">
              <li>Visuals, audio, and text on every card support diverse learners</li>
              <li>Sentence starters provided for the exit ticket</li>
              <li>Extension: Students design an infographic or short video for younger grades</li>
              <li>Indigenous learners can connect content to local Nation knowledge (Qayqayt, Kwikwetlem, Musqueam)</li>
            </ul>
          </Card>
          <Card className="p-6 bg-gradient-card shadow-soft">
            <ClipboardCheck className="h-6 w-6 text-forest mb-3" />
            <h3 className="text-xl font-semibold mb-3">Evidence of Learning</h3>
            <ul className="space-y-2 text-muted-foreground text-sm list-disc pl-5">
              <li>Completed Causes/Impacts/Solutions tracker (proficient: ≥10 cards explored)</li>
              <li>Jigsaw presentation rubric (clarity, evidence, BC connection)</li>
              <li>Exit ticket reviewed for misconceptions</li>
              <li>Solutions pitch — peer feedback using "Two stars and a wish"</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* References & Brand Footer */}
      <footer className="bg-foreground text-background py-14">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl mb-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sun text-sun-foreground">
                  <Sprout className="h-5 w-5" />
                </span>
                GaiaThinker
              </div>
              <p className="text-sm text-background/70">
                A learning experience by <a href="https://gaialink.ca" target="_blank" rel="noopener noreferrer" className="text-sun hover:underline">Gaialink Intelligence Systems Inc.</a> — building thoughtful tools for environmental learning.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-sun">References</h3>
              <ul className="space-y-1.5 text-sm text-background/70">
                <li>BC Ministry of Education K–12 Curriculum</li>
                <li>BC Climate Change Accountability Report</li>
                <li>City of New Westminster — Seven Bold Steps</li>
                <li>First Peoples Principles of Learning (FNESC)</li>
                <li>PhET Interactive Simulations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-sun">Connect</h3>
              <ul className="space-y-1.5 text-sm text-background/70">
                <li><a href="https://gaialink.ca" target="_blank" rel="noopener noreferrer" className="hover:text-background transition">gaialink.ca ↗</a></li>
                <li>Designed for the New Westminster School District (SD40)</li>
                <li>BC curriculum aligned · 2024</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/10 pt-6 text-xs text-background/60 flex flex-wrap justify-between gap-3">
            <span>© {new Date().getFullYear()} Gaialink Intelligence Systems Inc. All rights reserved.</span>
            <span>GaiaThinker™</span>
          </div>
        </div>
      </footer>
      <VoiceAssistant />
    </main>
  );
};

export default Index;
