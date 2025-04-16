"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { getDictionary } from "@/dictionaries";

interface StopwatchProps {
  onBack: () => void;
  lang: string;
}

export default function Stopwatch({ onBack, lang }: StopwatchProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const dictionary = getDictionary(lang);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsPaused(isRunning);
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
  };

  // Format time as hh:mm:ss:ms
  const formatTime = () => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    const mainTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    const ms = milliseconds.toString().padStart(2, "0");

    return { mainTime, ms };
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl">
      <div className="flex justify-between items-center w-full mb-6 sm:mb-12 md:mb-16 lg:mb-24">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-auto w-auto p-2 border border-gray-300"
        >
          <ArrowLeft className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-18 lg:w-18" />
        </Button>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          {dictionary.stopwatch}
        </h1>
        <div className="w-8 sm:w-10 md:w-12 lg:w-18" />
      </div>

      <div className="flex flex-col items-center justify-center mb-6 sm:mb-12 md:mb-16 lg:mb-24">
        <div className="text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] xl:text-[15rem] font-inter font-bold tabular-nums leading-[0.8] tracking-wider">
          {formatTime().mainTime}
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-inter mt-2 opacity-80">
          {formatTime().ms}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12 w-full sm:w-auto justify-center">
        <Button
          size="lg"
          onClick={handleStartStop}
          className="text-xl sm:text-2xl md:text-2xl lg:text-3xl py-4 sm:py-6 md:py-7 lg:py-8 px-6 sm:px-8 md:px-10 lg:px-12 h-auto w-full sm:w-auto"
        >
          {isRunning ? (
            <Pause className="mr-2 sm:mr-3 md:mr-4 lg:mr-6 h-6 sm:h-8 md:h-10 lg:h-12 w-6 sm:w-8 md:w-10 lg:w-12" />
          ) : (
            <Play className="mr-2 sm:mr-3 md:mr-4 lg:mr-6 h-6 sm:h-8 md:h-10 lg:h-12 w-6 sm:w-8 md:w-10 lg:w-12" />
          )}
          {isRunning
            ? dictionary.pause
            : isPaused
            ? dictionary.resume
            : dictionary.start}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleReset}
          className="text-xl sm:text-2xl md:text-2xl lg:text-3xl py-4 sm:py-6 md:py-7 lg:py-8 px-6 sm:px-8 md:px-10 lg:px-12 h-auto w-full sm:w-auto"
        >
          <RotateCcw className="mr-2 sm:mr-3 md:mr-4 lg:mr-6 h-6 sm:h-8 md:h-10 lg:h-12 w-6 sm:w-8 md:w-10 lg:w-12" />
          {dictionary.reset}
        </Button>
      </div>
    </div>
  );
}
