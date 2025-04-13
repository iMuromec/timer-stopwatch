"use client";

import { useState } from "react";
import { Clock, TimerIcon } from "lucide-react";
import Stopwatch from "@/components/stopwatch";
import Timer from "@/components/timer";
import { getDictionary } from "@/dictionaries";
import { useParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const lang = params.lang as string;

  const [activeComponent, setActiveComponent] = useState<
    "none" | "stopwatch" | "timer"
  >("none");
  const dictionary = getDictionary(lang);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 font-inter">
      {activeComponent === "none" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 md:gap-16 lg:gap-24 w-full max-w-7xl">
          <button
            onClick={() => setActiveComponent("stopwatch")}
            className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-16 lg:p-24 rounded-3xl border-4 border-border hover:border-primary transition-colors"
          >
            <Clock className="w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-72 lg:h-72 mb-4 sm:mb-6 md:mb-8 lg:mb-12 text-primary" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-semibold">
              {dictionary.stopwatch}
            </h2>
          </button>
          <button
            onClick={() => setActiveComponent("timer")}
            className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-16 lg:p-24 rounded-3xl border-4 border-border hover:border-primary transition-colors"
          >
            <TimerIcon className="w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-72 lg:h-72 mb-4 sm:mb-6 md:mb-8 lg:mb-12 text-primary" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-semibold">
              {dictionary.timer}
            </h2>
          </button>
        </div>
      ) : activeComponent === "stopwatch" ? (
        <Stopwatch onBack={() => setActiveComponent("none")} lang={lang} />
      ) : (
        <Timer onBack={() => setActiveComponent("none")} lang={lang} />
      )}
    </main>
  );
}
