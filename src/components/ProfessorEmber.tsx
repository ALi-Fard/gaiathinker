import { useState } from "react";
import owl from "@/assets/professor-ember.png";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  message: string;
  onClose?: () => void;
  actions?: { label: string; onClick: () => void; variant?: "default" | "outline" }[];
  compact?: boolean;
}

export const ProfessorEmber = ({ message, onClose, actions, compact }: Props) => {
  return (
    <div
      className={`fixed ${compact ? "bottom-24" : "bottom-6"} right-6 z-50 w-[320px] max-w-[calc(100vw-2rem)] animate-fade-in`}
      style={{ animation: "fade-in 0.4s ease-out" }}
    >
      <div className="relative rounded-2xl bg-white border-2 shadow-2xl p-4" style={{ borderColor: "#2d5a3d" }}>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="flex gap-3 items-start">
          <img src={owl} alt="Professor Ember" className="h-16 w-16 rounded-full object-contain bg-glacier/40 shrink-0" />
          <div className="flex-1 pt-1">
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "#2d5a3d" }}>
              Professor Ember 🦉
            </div>
            <div className="text-[10px] text-muted-foreground italic mb-2">Your AI Climate Thinking Partner</div>
          </div>
        </div>
        <div className="mt-2 text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-[40vh] overflow-y-auto">
          {message}
        </div>
        {actions && (
          <div className="mt-4 flex flex-col gap-2">
            {actions.map((a, i) => (
              <Button key={i} onClick={a.onClick} size="sm" variant={a.variant ?? "default"}
                className={a.variant === "outline" ? "" : "bg-[#2d5a3d] hover:bg-[#2d5a3d]/90 text-white"}>
                {a.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const AskEmberButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 z-40 rounded-full bg-white border-2 shadow-lg px-4 py-2 flex items-center gap-2 hover:scale-105 transition"
    style={{ borderColor: "#2d5a3d" }}
  >
    <img src={owl} alt="" className="h-8 w-8 rounded-full object-contain" />
    <span className="text-sm font-semibold" style={{ color: "#2d5a3d" }}>🦉 Ask Professor Ember</span>
  </button>
);
