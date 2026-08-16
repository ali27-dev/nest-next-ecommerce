"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onCancel]);

  return (
    <div
      onClick={onCancel}
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className={cn(
          "w-full max-w-sm bg-background rounded-xl shadow-2xl p-6 transition-all duration-200",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 id="confirm-dialog-title" className="text-sm font-semibold">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="h-9"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
