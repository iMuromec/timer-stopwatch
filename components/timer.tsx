"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import { getDictionary } from "@/dictionaries";

interface TimerProps {
  onBack: () => void;
  lang: string;
}

export default function Timer({ onBack, lang }: TimerProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef<number>(0);
  const pausedTimeLeftRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const dictionary = getDictionary(lang);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      if (pausedTimeLeftRef.current > 0) {
        endTimeRef.current = Date.now() + pausedTimeLeftRef.current * 1000;
        pausedTimeLeftRef.current = 0;
      } else {
        endTimeRef.current = Date.now() + timeLeft * 1000;
      }

      lastUpdateTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(
          0,
          Math.ceil((endTimeRef.current - now) / 1000)
        );

        if (remaining <= 0) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          setIsRunning(false);
          setIsPaused(false);
          setMilliseconds(0);
          setTimeLeft(0);
        } else {
          setTimeLeft(remaining);

          const ms = Math.floor(((endTimeRef.current - now) % 1000) / 10);
          setMilliseconds(ms);
        }

        lastUpdateTimeRef.current = now;
      }, 10);
    } else if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);

        if (timeLeft > 0 && isConfiguring === false) {
          pausedTimeLeftRef.current = timeLeft;
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, isConfiguring]);

  const handleStartStop = () => {
    if (isConfiguring) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (totalSeconds > 0) {
        setTimeLeft(totalSeconds);
        setMilliseconds(99);
        setIsConfiguring(false);
        setIsRunning(true);
      }
    } else {
      setIsPaused(isRunning);
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsConfiguring(true);
    setTimeLeft(0);
    setMilliseconds(0);
    pausedTimeLeftRef.current = 0;
  };

  // Format time as hh:mm:ss
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0;
    setHours(Math.max(0, Math.min(99, value)));
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0;
    setMinutes(Math.max(0, Math.min(59, value)));
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0;
    setSeconds(Math.max(0, Math.min(59, value)));
  };

  // Функции для увеличения/уменьшения значений с помощью кнопок
  const incrementHours = () => {
    setHours((prev) => Math.min(prev + 1, 99));
  };

  const decrementHours = () => {
    setHours((prev) => Math.max(prev - 1, 0));
  };

  const incrementMinutes = () => {
    setMinutes((prev) => Math.min(prev + 1, 59));
  };

  const decrementMinutes = () => {
    setMinutes((prev) => Math.max(prev - 1, 0));
  };

  const incrementSeconds = () => {
    setSeconds((prev) => Math.min(prev + 1, 59));
  };

  const decrementSeconds = () => {
    setSeconds((prev) => Math.max(prev - 1, 0));
  };

  // Функция для установки предустановленного времени
  const setPresetTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    setHours(hrs);
    setMinutes(mins);
    setSeconds(secs);
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
          {dictionary.timer}
        </h1>
        <div className="w-8 sm:w-10 md:w-12 lg:w-18" />
      </div>

      {isConfiguring ? (
        <div className="flex flex-col items-center mb-6 sm:mb-12 md:mb-16 lg:mb-24">
          <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 items-center mb-6">
            {/* Часы */}
            <div className="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={incrementHours}
                className="mb-2 h-10 w-10 sm:h-12 sm:w-12"
              >
                <Plus className="h-6 w-6" />
              </Button>
              <Input
                type="number"
                min="0"
                max="99"
                value={hours}
                onChange={handleHoursChange}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-inter w-24 sm:w-36 md:w-48 lg:w-72 text-center p-4 sm:p-6 md:p-8 lg:p-12 h-auto leading-[0.8] tracking-wider"
              />
              <div className="flex w-full justify-end">
                <div className="text-xs sm:text-sm md:text-base lg:text-base mt-1">
                  {dictionary.hours}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={decrementHours}
                className="mt-2 mb-2 h-10 w-10 sm:h-12 sm:w-12"
              >
                <Minus className="h-6 w-6" />
              </Button>
            </div>

            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-inter leading-[0.8] tracking-wider">
              :
            </span>

            {/* Минуты */}
            <div className="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={incrementMinutes}
                className="mb-2 h-10 w-10 sm:h-12 sm:w-12"
              >
                <Plus className="h-6 w-6" />
              </Button>
              <Input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={handleMinutesChange}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-inter w-24 sm:w-36 md:w-48 lg:w-72 text-center p-4 sm:p-6 md:p-8 lg:p-12 h-auto leading-[0.8] tracking-wider"
              />
              <div className="flex w-full justify-end">
                <div className="text-xs sm:text-sm md:text-base lg:text-base mt-1">
                  {dictionary.minutes}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={decrementMinutes}
                className="mt-2 mb-2 h-10 w-10 sm:h-12 sm:w-12"
              >
                <Minus className="h-6 w-6" />
              </Button>
            </div>

            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-inter leading-[0.8] tracking-wider">
              :
            </span>

            {/* Секунды */}
            <div className="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={incrementSeconds}
                className="mb-2 h-10 w-10 sm:h-12 sm:w-12"
              >
                <Plus className="h-6 w-6" />
              </Button>
              <Input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={handleSecondsChange}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-inter w-24 sm:w-36 md:w-48 lg:w-72 text-center p-4 sm:p-6 md:p-8 lg:p-12 h-auto leading-[0.8] tracking-wider"
              />
              <div className="flex w-full justify-end">
                <div className="text-xs sm:text-sm md:text-base lg:text-base mt-1">
                  {dictionary.seconds}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={decrementSeconds}
                className="mt-2 mb-2 h-10 w-10 sm:h-12 sm:w-12"
              >
                <Minus className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mb-6 sm:mb-12 md:mb-16 lg:mb-24">
          <div className="text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] xl:text-[15rem] font-inter font-bold tabular-nums leading-[0.8] tracking-wider">
            {formatTime(timeLeft)}
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-inter mt-2 opacity-80">
            {milliseconds.toString().padStart(2, "0")}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12 w-full sm:w-auto justify-center">
        <Button
          size="lg"
          onClick={handleStartStop}
          disabled={
            isConfiguring && hours === 0 && minutes === 0 && seconds === 0
          }
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
