"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react"
import { getDictionary } from "@/dictionaries"

interface TimerProps {
  onBack: () => void
  lang: string
}

export default function Timer({ onBack, lang }: TimerProps) {
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isConfiguring, setIsConfiguring] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const dictionary = getDictionary(lang)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current as NodeJS.Timeout)
            setIsRunning(false)
            setIsPaused(false)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleStartStop = () => {
    if (isConfiguring) {
      const totalSeconds = minutes * 60 + seconds
      if (totalSeconds > 0) {
        setTimeLeft(totalSeconds)
        setIsConfiguring(false)
        setIsRunning(true)
      }
    } else {
      setIsPaused(isRunning)
      setIsRunning(!isRunning)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setIsConfiguring(true)
    setTimeLeft(0)
  }

  // Format time as mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setMinutes(Math.max(0, Math.min(99, value)))
  }

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setSeconds(Math.max(0, Math.min(59, value)))
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl">
      <div className="flex justify-between items-center w-full mb-6 sm:mb-12 md:mb-16 lg:mb-24">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-auto w-auto p-2">
          <ArrowLeft className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-18 lg:w-18" />
        </Button>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">{dictionary.timer}</h1>
        <div className="w-8 sm:w-10 md:w-12 lg:w-18" />
      </div>

      {isConfiguring ? (
        <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 items-center mb-6 sm:mb-12 md:mb-16 lg:mb-24">
          <Input
            type="number"
            min="0"
            max="99"
            value={minutes}
            onChange={handleMinutesChange}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-mono w-24 sm:w-36 md:w-48 lg:w-72 text-center p-4 sm:p-6 md:p-8 lg:p-12 h-auto"
          />
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-mono">:</span>
          <Input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={handleSecondsChange}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-mono w-24 sm:w-36 md:w-48 lg:w-72 text-center p-4 sm:p-6 md:p-8 lg:p-12 h-auto"
          />
        </div>
      ) : (
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-[8rem] font-mono font-bold mb-6 sm:mb-12 md:mb-16 lg:mb-24 tabular-nums">
          {formatTime(timeLeft)}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-12 w-full sm:w-auto justify-center">
        <Button
          size="lg"
          onClick={handleStartStop}
          disabled={isConfiguring && minutes === 0 && seconds === 0}
          className="text-xl sm:text-2xl md:text-2xl lg:text-3xl py-4 sm:py-6 md:py-7 lg:py-8 px-6 sm:px-8 md:px-10 lg:px-12 h-auto w-full sm:w-auto"
        >
          {isRunning ? (
            <Pause className="mr-2 sm:mr-3 md:mr-4 lg:mr-6 h-6 sm:h-8 md:h-10 lg:h-12 w-6 sm:w-8 md:w-10 lg:w-12" />
          ) : (
            <Play className="mr-2 sm:mr-3 md:mr-4 lg:mr-6 h-6 sm:h-8 md:h-10 lg:h-12 w-6 sm:w-8 md:w-10 lg:w-12" />
          )}
          {isRunning ? dictionary.pause : isPaused ? dictionary.resume : dictionary.start}
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
  )
}
