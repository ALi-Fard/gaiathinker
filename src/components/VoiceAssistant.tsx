import { useEffect, useRef, useState } from "react";
import { Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const VAPI_SRC =
  "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
const API_KEY = "14b7ab29-20cc-4563-8bcd-32a00384aed5";
const ASSISTANT_ID = "bb443187-0928-4259-b775-ccf04cff6160";

declare global {
  interface Window {
    vapiSDK?: {
      run: (opts: {
        apiKey: string;
        assistant: string;
        config?: Record<string, unknown>;
      }) => any;
    };
  }
}

export const VoiceAssistant = () => {
  const [open, setOpen] = useState(false);
  const widgetInstanceRef = useRef<any>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  // Lock scroll + ESC to close
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

  // Mount / unmount widget
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const launch = () => {
      if (cancelled || !window.vapiSDK) return;
      try {
        widgetInstanceRef.current = window.vapiSDK.run({
          apiKey: API_KEY,
          assistant: ASSISTANT_ID,
          config: { position: "bottom-right" },
        });
      } catch (err) {
        console.error("Voice assistant failed to start", err);
      }
    };

    const ensureScript = () => {
      if (window.vapiSDK) {
        launch();
        return;
      }
      let script = document.querySelector<HTMLScriptElement>(
        'script[data-gaia-voice="1"]',
      );
      if (!script) {
        script = document.createElement("script");
        script.src = VAPI_SRC;
        script.async = true;
        script.defer = true;
        script.dataset.gaiaVoice = "1";
        script.onload = launch;
        document.body.appendChild(script);
      } else {
        script.addEventListener("load", launch, { once: true });
        if (window.vapiSDK) launch();
      }
    };

    ensureScript();

    return () => {
      cancelled = true;
      // Try to stop/destroy the widget instance if the SDK exposes a method
      const inst = widgetInstanceRef.current;
      if (inst) {
        try {
          if (typeof inst.stop === "function") inst.stop();
          else if (typeof inst.destroy === "function") inst.destroy();
          else if (typeof inst.close === "function") inst.close();
        } catch {
          /* ignore */
        }
      }
      widgetInstanceRef.current = null;

      // Remove any DOM nodes the widget injected so audio stops
      document
        .querySelectorAll(
          '[id^="vapi"], [class*="vapi"], iframe[src*="vapi"]',
        )
        .forEach((el) => el.remove());
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
            className="relative w-full max-w-2xl h-[70vh] max-h-[700px] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border"
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

            <div className="flex-1 relative bg-gradient-to-br from-background to-muted/40 flex flex-col items-center justify-center text-center p-6">
              <div
                ref={mountRef}
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              />
              <div className="relative z-10 max-w-sm space-y-3">
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-forest to-ocean flex items-center justify-center shadow-lg">
                  <Mic className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Talk with GaiaThinker
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tap the floating microphone in the lower‑right corner to start
                  a live voice conversation about climate change, BC ecosystems,
                  and what we can do about it.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
