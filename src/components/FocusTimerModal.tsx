import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Plus, Minus, Bell, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudySlot } from '../types';

interface FocusTimerModalProps {
  slot: StudySlot | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteSlot: (slotId: string) => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  slot,
  isOpen,
  onClose,
  onCompleteSlot
}) => {
  if (!isOpen || !slot) return null;

  const initialMinutes = slot.durationMinutes || 25;
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(initialMinutes * 60);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play gentle Web Audio chime
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // AudioContext unavailable
    }
  };

  useEffect(() => {
    setTimeLeft(slot.durationMinutes * 60);
    setTotalSessionSeconds(slot.durationMinutes * 60);
    setIsRunning(false);
  }, [slot]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playChime();
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 }
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalSessionSeconds);
  };

  const adjustMinutes = (deltaMin: number) => {
    setTimeLeft((prev) => {
      const next = Math.max(60, prev + deltaMin * 60);
      setTotalSessionSeconds(next);
      return next;
    });
  };

  const handleMarkDone = () => {
    onCompleteSlot(slot.id);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    onClose();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = totalSessionSeconds > 0
    ? Math.max(0, Math.min(100, ((totalSessionSeconds - timeLeft) / totalSessionSeconds) * 100))
    : 0;

  const isBreak = slot.activityType === 'break';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                isBreak ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              }`}>
                {isBreak ? '☕ ช่วงเวลาพักผ่อน' : '🎯 กำลังโฟกัส'}
              </span>
              <span className="text-xs text-slate-400 font-mono tabular-nums">{slot.time}</span>
            </div>
            <h3 className="text-base font-semibold text-white mt-1">
              {slot.subject}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
              {slot.topic}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Circular / Large Digital Display */}
        <div className="py-8 flex flex-col items-center justify-center">
          <div className="relative w-52 h-52 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center bg-slate-950/60 overflow-hidden">
            {/* SVG Ring Progress */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="104"
                cy="104"
                r="98"
                stroke="currentColor"
                strokeWidth="5"
                fill="transparent"
                className={isBreak ? "text-amber-500" : "text-indigo-500"}
                strokeDasharray="615.7"
                strokeDashoffset={615.7 - (615.7 * progressPercent) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>

            <span className="text-5xl font-mono font-bold tracking-tight text-white tabular-nums z-10">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 mt-1 z-10 flex items-center gap-1">
              {isRunning ? (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  กำลังนับเวลา
                </span>
              ) : timeLeft === 0 ? (
                <span className="text-amber-400 font-medium">จบช่วงเวลาแล้ว!</span>
              ) : (
                'หยุดชั่วคราว'
              )}
            </span>
          </div>

          {/* Quick Adjust +/- 5 min */}
          <div className="flex items-center gap-2 mt-4 text-xs">
            <button
              onClick={() => adjustMinutes(-5)}
              disabled={isRunning || timeLeft <= 300}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-md transition-colors flex items-center gap-1"
            >
              <Minus className="w-3 h-3" /> 5 นาที
            </button>
            <button
              onClick={() => adjustMinutes(5)}
              disabled={isRunning}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-md transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> 5 นาที
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={resetTimer}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            title="รีเซ็ตเวลา"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleTimer}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" /> หยุดชั่วคราว
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> เริ่มโฟกัส
              </>
            )}
          </button>

          <button
            onClick={handleMarkDone}
            className={`p-3 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium ${
              slot.completed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300'
            }`}
            title="เช็คว่าอ่านเสร็จแล้ว"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">เสร็จแล้ว</span>
          </button>
        </div>
      </div>
    </div>
  );
};
