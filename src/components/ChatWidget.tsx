import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

const ChatWidget = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkReady = () => {
      if ((window as any).voiceflow?.chat) {
        setIsReady(true);
      }
    };

    checkReady();
    const interval = setInterval(checkReady, 500);
    const timeout = setTimeout(() => clearInterval(interval), 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleClick = () => {
    const vf = (window as any).voiceflow;
    if (vf?.chat) {
      vf.chat.show();
      vf.chat.open();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 pointer-events-none">
      <span className="hidden sm:inline-block text-sm font-medium text-foreground bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-soft border border-border pointer-events-auto">
        Chat with GaiaLink AI
      </span>
      <button
        onClick={handleClick}
        disabled={!isReady}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-glow hover:scale-105 transition-transform disabled:opacity-50 pointer-events-auto"
        style={{
          background: "linear-gradient(135deg, hsl(155 45% 25%) 0%, hsl(198 70% 38%) 100%)",
        }}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ChatWidget;
