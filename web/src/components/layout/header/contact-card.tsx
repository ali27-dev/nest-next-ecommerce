"use client";

import { X, Phone, MessageCircle, Mail } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  open: boolean;
  onClose: () => void;
}

const contactMethods = [
  {
    label: "Call us",
    value: "+92 300 0000000",
    href: "tel:+923000000000",
    icon: Phone,
    external: false,
  },
  {
    label: "WhatsApp",
    value: "+92 300 0000000",
    href: "https://wa.me/923000000000",
    icon: MessageCircle,
    external: true,
  },
  {
    label: "Email",
    value: "support@farzarastore.com",
    href: "mailto:support@farzarastore.com",
    icon: Mail,
    external: false,
  },
];

export function ContactCard({ open, onClose }: ContactCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  return (
    <div
      onClick={onClose}
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200",
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Contact us"
        className={cn(
          "w-[90vw] max-w-sm rounded-xl border bg-background shadow-2xl transition-all duration-200",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b">
          <span className="font-semibold text-lg">Contact Us</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <a
                key={method.label}
                href={method.href}
                target={method.external ? "_blank" : undefined}
                rel={method.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 rounded-lg border px-4 py-3 hover:bg-accent transition-colors"
              >
                <Icon className="h-6 w-6 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">{method.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {method.value}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
