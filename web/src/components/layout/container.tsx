import { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-[1440px] mx-auto px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}
