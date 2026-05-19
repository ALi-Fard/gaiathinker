import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Copy, Mail, QrCode, BookOpen, Users, Clock, TreePine, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";

const makeCode = () => {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `FIRE-${n}`;
};

const WildfireLobby = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [members, setMembers] = useState<{ name: string; color: string }[]>([]);

  const createTeam = () => {
    const c = makeCode();
    setCode(c);
    const me = { name: "You (Team Leader)", color: "#2d5a3d" };
    setMembers([me]);
    localStorage.setItem("wildfire_team_code", c);
    localStorage.setItem("wildfire_team_name", "Team Cedar");
  };

  // Simulate teammates joining for solo demo
  useEffect(() => {
    if (!code) return;
    const colors = ["#0089cf", "#ff6b35", "#ffd66b"];
    const names = ["Priya", "Marcus", "Sage"];
    const timers = names.map((n, i) =>
      setTimeout(() => setMembers((m) => [...m, { name: n, color: colors[i] }]), (i + 1) * 3000)
    );
    return () => timers.forEach(clearTimeout);
  }, [code]);

  const startGame = () => {
    navigate("/wildfire/game");
  };

  const joinTeam = () => {
    if (!joinCode.trim()) {
      toast.error("Enter a room code");
      return;
    }
    localStorage.setItem("wildfire_team_code", joinCode.trim().toUpperCase());
    localStorage.setItem("wildfire_team_name", "Team Cedar");
    navigate("/wildfire/game");
  };

  const copy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success("Code copied!");
    }
  };

  return (
    <main className="min-h-screen" style={{ background: "#fbf6ea" }}>
      <div className="container max-w-6xl py-10">
        <Link to="/" className="inline-flex items-center text-sm hover:underline mb-6" style={{ color: "#2d5a3d" }}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to GaiaThinker
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: "#2d5a3d", fontFamily: "Fraunces, serif" }}>
            🔥 Wildfire Prevention Team Challenge
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Work together to protect BC's interior. Your team has $50M and 2 years. What's your strategy?
          </p>
          <div className="mt-6 flex justify-center gap-6 flex-wrap text-sm font-medium">
            <span className="flex items-center gap-2"><Users className="h-4 w-4" /> 3-4 students per team</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> 30 minutes</span>
            <span className="flex items-center gap-2"><TreePine className="h-4 w-4" /> Real BC data, real stakes</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create */}
          <Card className="p-6 border-2" style={{ borderColor: "#2d5a3d" }}>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#2d5a3d" }}>Create a Team</h2>
            <p className="text-sm text-muted-foreground mb-4">You're the team leader. Share the code with classmates.</p>
            {!code ? (
              <Button onClick={createTeam} size="lg" className="w-full bg-[#2d5a3d] hover:bg-[#2d5a3d]/90 text-white">
                Create New Team
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="text-center bg-glacier/30 rounded-xl p-6">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Room Code</div>
                  <div className="text-4xl font-bold tracking-wider" style={{ color: "#2d5a3d" }}>{code}</div>
                  <Button onClick={copy} variant="outline" size="sm" className="mt-3">
                    <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Code
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm"><QrCode className="h-3.5 w-3.5 mr-1.5" /> QR</Button>
                  <Button variant="outline" size="sm"><Mail className="h-3.5 w-3.5 mr-1.5" /> Email</Button>
                  <Button variant="outline" size="sm"><BookOpen className="h-3.5 w-3.5 mr-1.5" /> Google Classroom</Button>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    Waiting for teammates... ({members.length}/4 joined)
                  </div>
                  <ul className="space-y-2">
                    {members.map((m, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="h-3 w-3 rounded-full" style={{ background: m.color }} />
                        {m.name}
                      </li>
                    ))}
                  </ul>
                </div>
                {members.length >= 2 && (
                  <Button onClick={startGame} size="lg" className="w-full bg-[#2d5a3d] hover:bg-[#2d5a3d]/90 text-white">
                    🚀 Start Game
                  </Button>
                )}
              </div>
            )}
          </Card>

          {/* Join */}
          <Card className="p-6 border-2 border-border">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#2d5a3d" }}>Join a Team</h2>
            <p className="text-sm text-muted-foreground mb-4">Enter the room code your team leader shared.</p>
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="FIRE-XXXX"
              className="text-2xl font-bold text-center h-16 mb-3 tracking-wider"
            />
            <Button onClick={joinTeam} size="lg" className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white">
              Join Team →
            </Button>
            <div className="mt-6 pt-4 border-t">
              <div className="text-xs uppercase text-muted-foreground mb-2">Other ways to join:</div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm"><QrCode className="h-3.5 w-3.5 mr-1.5" /> Scan QR</Button>
                <Button variant="outline" size="sm"><Mail className="h-3.5 w-3.5 mr-1.5" /> Email Link</Button>
                <Button variant="outline" size="sm"><BookOpen className="h-3.5 w-3.5 mr-1.5" /> Classroom</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <div className="inline-block bg-white rounded-full px-6 py-3 shadow-sm border">
            🏆 Teams competing right now: <span className="font-bold" style={{ color: "#ff6b35" }}>5</span>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default WildfireLobby;
