"use client"

import MobileFrame from "./mobile-frame"
import { Button } from "@/components/ui/button"

interface OnboardingScreenProps {
  onGetStarted: () => void
}

export default function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  return (
    <MobileFrame>
      <div className="flex flex-col items-center justify-center h-full px-8 pt-20">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-32 h-32 mb-8">
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            GUAU <span className="text-orange-500">PRO</span>
          </h1>
        </div>

        <Button
          onClick={onGetStarted}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-medium mb-8"
        >
          Comenzar
        </Button>
      </div>
    </MobileFrame>
  )
}
