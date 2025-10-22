import svgPaths from "./figma/svg-9hcod3xg5a";
import imgLogoGuau from "./images/logo_guau.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

function StatusIcons() {
  return (
    <div
      className="absolute h-[12px] right-[12.5px] top-[16px] w-[66.5px]"
      data-name="Status Icons"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 67 12"
      >
        <g id="Status Icons">
          <g id="Network Signal">
            <path
              d={svgPaths.p2b90f980}
              fill="var(--fill-0, #101113)"
              id="NetworkSignal-path"
            />
            <path
              d={svgPaths.p9778000}
              fill="var(--fill-0, #101113)"
              id="NetworkSignal-path_2"
            />
            <path
              d={svgPaths.p2cb61900}
              fill="var(--fill-0, #101113)"
              id="NetworkSignal-path_3"
            />
            <path
              d={svgPaths.p26488880}
              fill="var(--fill-0, #101113)"
              fillOpacity="0.2"
              id="NetworkSignal-path_4"
            />
          </g>
          <path
            d={svgPaths.p1ead8500}
            fill="var(--fill-0, #101113)"
            id="Wi-Fi"
          />
          <g id="Battery">
            <rect
              height="11"
              id="Border"
              rx="2.16667"
              stroke="var(--stroke-0, #101113)"
              strokeOpacity="0.6"
              width="21.6077"
              x="42"
              y="0.5"
            />
            <path
              d={svgPaths.p21b4b800}
              fill="var(--fill-0, #101113)"
              fillOpacity="0.6"
              id="Cap"
            />
            <rect
              fill="var(--fill-0, #101113)"
              height="7.76471"
              id="Capacity"
              rx="1.33333"
              width="18.4972"
              x="43.5547"
              y="2.11768"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Time() {
  return (
    <div
      className="absolute content-stretch flex gap-[10px] items-center justify-center left-[10px] top-[13px] w-[75px]"
      data-name="Time"
    >
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#101113] text-[15px] text-center text-nowrap tracking-[-0.17px]">
        <p className="leading-[normal] whitespace-pre">09:41</p>
      </div>
    </div>
  );
}

function StatusBarIosIPhoneWithPhoneNotch() {
  return (
    <div
      className="absolute h-[44px] left-0 overflow-clip top-0 w-[375px]"
      data-name="Status Bar / IOS iPhone — with phone notch"
    >
      <StatusIcons />
      <Time />
      <div
        className="absolute h-[31px] left-[112px] top-[-2px] w-[150px]"
        data-name="Notch"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 150 31"
        >
          <path
            clipRule="evenodd"
            d={svgPaths.p1096f300}
            fill="var(--fill-0, #101113)"
            fillRule="evenodd"
            id="Notch"
          />
        </svg>
      </div>
    </div>
  );
}

function StatusBarNavHeader({ onGetStarted }: OnboardingScreenProps) {
  return (
    <div
      className="h-[812px] relative shrink-0 w-[375px]"
      data-name="Status Bar + Nav Header"
    >
      <div
        className="absolute h-[138px] left-[calc(50%-0.5px)] top-[calc(50%-20px)] translate-x-[-50%] translate-y-[-50%] w-[144px]"
        data-name="logo_guau"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src={imgLogoGuau}
            alt="logo_guau"
            className="absolute h-full w-full object-cover"
          />
        </div>
      </div>
      <StatusBarIosIPhoneWithPhoneNotch />
      <div className="absolute flex flex-col font-['Catamaran:Bold',_sans-serif] font-bold justify-end leading-[0] left-[calc(50%-145.5px)] text-[#ea6431] text-[18px] text-nowrap top-[526px] translate-y-[-100%]">
        <p className="leading-[20px] whitespace-pre">
          Todo sobre tu perro, en un solo lugar
        </p>
      </div>
      <Button
        onClick={onGetStarted}
        className="absolute bg-white text-gray-600 px-8 py-3 rounded-full left-1/2 -translate-x-1/2 top-[560px] shadow-sm hover:bg-gray-50 transition-colors"
      >
        Continuar
      </Button>
    </div>
  );
}

export default function OnboardingScreen({
  onGetStarted,
}: OnboardingScreenProps) {
  const handleGetStarted = () => {
    console.log("Botón presionado, siguiente paso...");
  };

  return (
    <div
      className="bg-white content-stretch flex flex-col gap-[10px] items-center justify-center overflow-clip relative rounded-[26px] size-full"
      data-name="onboarding"
    >
      <StatusBarNavHeader onGetStarted={onGetStarted} />
    </div>
  );
}
