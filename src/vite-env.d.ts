/// <reference types="vite/client" />

declare global {
  interface Window {
    voiceflow?: {
      chat: {
        load: (config: Record<string, unknown>) => void;
        open: () => void;
        close: () => void;
        show: () => void;
        hide: () => void;
      };
    };
  }
}

