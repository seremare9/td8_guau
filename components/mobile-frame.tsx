import type { ReactNode } from "react"

interface MobileFrameProps {
  children: ReactNode
}

export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen relative overflow-hidden">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 py-3 text-sm font-medium">
        <span>09:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          </div>
          <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.415 5 5 0 017.07 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div className="w-6 h-3 border border-black rounded-sm relative">
            <div className="w-4 h-2 bg-black rounded-sm absolute top-0.5 left-0.5"></div>
            <div className="w-0.5 h-1 bg-black rounded-sm absolute -right-1 top-1"></div>
          </div>
        </div>
      </div>

      {/* Notch */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl"></div>

      {children}
    </div>
  )
}
