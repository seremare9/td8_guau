import type { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="w-full max-w-full mx-auto bg-white min-h-screen relative overflow-hidden" style={{ maxWidth: '100%', width: '100%' }}>
      {children}
    </div>
  );
}
