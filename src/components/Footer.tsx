import { Sprout } from "lucide-react";

export const Footer = () => (
  <footer className="bg-foreground text-background py-10 mt-10">
    <div className="container max-w-6xl text-center">
      <div className="flex items-center justify-center gap-2 font-bold text-lg mb-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sun text-sun-foreground">
          <Sprout className="h-4 w-4" />
        </span>
        GaiaThinker
      </div>
      <p className="text-sm text-background/70 max-w-2xl mx-auto">
        A learning experience by{" "}
        <a href="https://gaiasystems.ca" target="_blank" rel="noopener noreferrer" className="text-sun hover:underline">
          Gaialink Intelligence Systems Inc.
        </a>{" "}
        — building thoughtful tools for environmental learning.
      </p>
      <p className="text-xs text-background/50 mt-3">
        <a href="https://gaiasystems.ca" target="_blank" rel="noopener noreferrer" className="hover:underline">
          gaiasystems.ca ↗
        </a>
      </p>
    </div>
  </footer>
);
