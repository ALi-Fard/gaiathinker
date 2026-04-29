import { useEffect, useState } from "react";
import { Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const VOICE_URL =
  "https://vapi.ai?demo=true&shareKey=14b7ab29-20cc-4563-8bcd-32a00384aed5&assistantId=bb443187-0928-4259-b775-ccf04cff6160";

export const VoiceAssistant = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 z-40 rounded-full shadow-2xl bg-gradient-to-br from-forest to-ocean text-white hover:opacity-95 hover:shadow-[0_10px_40px_-10px_hsl(var(--forest))]"
        aria-label="Talk to GaiaThinker"
      >
        <Mic className="h-4 w-4" />
        <span className="font-semibold">🎤 Talk to GaiaThinker</span>
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="GaiaThinker Voice Assistant"
        >
          <div
            className="relative w-full max-w-3xl h-[80vh] max-h-[800px] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b bg-gradient-to-r from-forest to-ocean text-white">
              <h2 className="font-semibold text-base md:text-lg flex items-center gap-2">
                <Mic className="h-4 w-4" /> GaiaThinker Voice Assistant
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close voice assistant"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 bg-background">
              <iframe
                key={open ? "voice-on" : "voice-off"}
                src={VOICE_URL}
                title="GaiaThinker Voice Assistant"
                allow="microphone; autoplay; clipboard-write"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
