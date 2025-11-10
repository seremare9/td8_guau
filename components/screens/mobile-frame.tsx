import type { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen relative overflow-hidden">
      {children}
    </div>
  );
}
