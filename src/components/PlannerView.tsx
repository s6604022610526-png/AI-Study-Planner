import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  Circle,
  Coffee,
  BookOpen,
  Edit3,
  Play,
  Share2,
  Download,
  Flame,
  ArrowRight,
  Sliders,
  Send,
  Check,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudyPlan, SubjectItem, StudySlot, DayPlan } from '../types';
import { FocusTimerModal } from './FocusTimerModal';
import { SubjectManagerModal } from './SubjectManagerModal';

interface PlannerViewProps {
  plan: StudyPlan;
  subjects: SubjectItem[];
  onUpdatePlan: (newPlan: StudyPlan) => void;
  onUpdateSubjects: (newSubjects: SubjectItem[]) => void;
  isLoading: boolean;
  onGeneratePlan: (params: any) => Promise<void>;
  onRefinePlan: (instruction: string) => Promise<void>;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  plan,
  subjects,
  onUpdatePlan,
  onUpdateSubjects,
  isLoading,
  onGeneratePlan,
  onRefinePlan,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | 'all'>('all');
  const [activeSlotForTimer, setActiveSlotForTimer] = useState<StudySlot | null>(null);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // Constraints state
  const [totalDays, setTotalDays] = useState(14);
  const [weekdayHours, setWeekdayHours] = useState(3);
  const [weekendHours, setWeekendHours] = useState(5);
  const [weekdayTime, setWeekdayTime] = useState('19.00–22.00 น.');
  const [focusStrategy, setFocusStrategy] = useState('เน้นวิชาที่สอบก่อนและวิชาที่เข้าใจยาก');

  // Iterative prompt text
  const [iterativePrompt, setIterativePrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Slot completion handler
  const handleToggleSlot = (dayNum: number, slotId: string) => {
    const updatedDays = plan.days.map((day) => {
      if (day.dayNumber === dayNum) {
        const updatedSlots = day.slots.map((s) => {
          if (s.id === slotId) {
            const nextCompleted = !s.completed;
            if (nextCompleted) {
              confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
            }
            return { ...s, completed: nextCompleted };
          }
          return s;
        });
        const allCompleted = updatedSlots.every((s) => s.completed);
        const someCompleted = updatedSlots.some((s) => s.completed);
        return {
          ...day,
          slots: updatedSlots,
          status: allCompleted ? ('completed' as const) : someCompleted ? ('in_progress' as const) : ('pending' as const),
        };
      }
      return day;
    });

    onUpdatePlan({ ...plan, days: updatedDays });
  };

  const handleTimerComplete = (slotId: string) => {
    const updatedDays = plan.days.map((day) => {
      const updatedSlots = day.slots.map((s) => {
        if (s.id === slotId) return { ...s, completed: true };
        return s;
      });
      return { ...day, slots: updatedSlots };
    });
    onUpdatePlan({ ...plan, days: updatedDays });
  };

  const handleRefineSubmit = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customText || iterativePrompt;
    if (!promptToSend.trim() || isRefining) return;

    setIsRefining(true);
    try {
      await onRefinePlan(promptToSend.trim());
      setIterativePrompt('');
    } finally {
      setIsRefining(false);
    }
  };

  // Metrics
  const totalSlots = plan.days.reduce((acc, d) => acc + d.slots.length, 0);
  const completedSlots = plan.days.reduce((acc, d) => acc + d.slots.filter((s) => s.completed).length, 0);
  const percentComplete = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  // Export to iCalendar (.ics)
  const handleExportICS = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AI Study Planner//KMUTNB//TH',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    const today = new Date();

    plan.days.forEach((day, dIdx) => {
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + dIdx);

      day.slots.forEach((slot, sIdx) => {
        const pad = (n: number) => String(n).padStart(2, '0');
        const y = eventDate.getFullYear();
        const m = pad(eventDate.getMonth() + 1);
        const d = pad(eventDate.getDate());

        // Parse time if possible (e.g. 19.00 -> 190000)
        const timeMatch = slot.time.match(/(\d{2})[.:](\d{2})/);
        const startHour = timeMatch ? timeMatch[1] : '19';
        const startMin = timeMatch ? timeMatch[2] : '00';

        const dtStart = `${y}${m}${d}T${startHour}${startMin}00`;
        const dtEnd = `${y}${m}${d}T${pad(Number(startHour) + 1)}${startMin}00`;

        icsContent.push(
          'BEGIN:VEVENT',
          `UID:study-${dIdx}-${sIdx}-${Date.now()}@aistudyplanner.local`,
          `DTSTAMP:${y}${m}${d}T000000Z`,
          `DTSTART:${dtStart}`,
          `DTEND:${dtEnd}`,
          `SUMMARY:[Study] ${slot.subject}: ${slot.topic}`,
          `DESCRIPTION:เป้าหมาย: ${day.dailyGoal}\\nประเภท: ${slot.activityType}`,
          'STATUS:CONFIRMED',
          'END:VEVENT'
        );
      });
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'study_planner.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy plan as Markdown
  const handleCopyMarkdown = () => {
    let md = `# 📚 AI Study Planner\n\n${plan.meta.summary}\n\n`;
    plan.days.forEach((day) => {
      md += `### 📅 ${day.dateFormatted} (${day.primarySubject})\n`;
      md += `🎯 **เป้าหมายวันนี้**: ${day.dailyGoal}\n\n`;
      md += `| ช่วงเวลา | วิชา | หัวข้อ | สถานะ |\n`;
      md += `| :--- | :--- | :--- | :--- |\n`;
      day.slots.forEach((s) => {
        md += `| ${s.time} | ${s.subject} | ${s.topic} | ${s.completed ? '✅ เสร็จแล้ว' : '⏳ ยังไม่เสร็จ'} |\n`;
      });
      md += `\n---\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const filteredDays = selectedDayNumber === 'all'
    ? plan.days
    : plan.days.filter((d) => d.dayNumber === selectedDayNumber);

  return (
    <div className="space-y-8">
      {/* Top Banner & Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                วางแผนด้วย Prompt Engineering สมบูรณ์แบบ
              </span>
              <span className="text-xs text-slate-400">· {plan.days.length} วันทั้งหมด</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              ตารางอ่านหนังสือรายวัน (Daily Study Plan)
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              {plan.meta.summary}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>ความคืบหน้ารวม</span>
                <span className="font-mono tabular-nums text-slate-200 font-semibold">{percentComplete}%</span>
              </div>
              <div className="w-48 sm:w-56 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>เสร็จแล้ว <strong className="text-slate-200 font-mono">{completedSlots}</strong> จาก <strong className="text-slate-200 font-mono">{totalSlots}</strong> คาบ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects in Exam & Action Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400">วิชาที่เตรียมสอบ:</span>
            {subjects.map((sub) => (
              <span
                key={sub.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 border border-slate-700/80 text-slate-200"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sub.color || '#6366F1' }} />
                <span>{sub.name}</span>
                <span className="text-slate-400 font-mono text-[11px]">({sub.examInDays} วัน)</span>
              </span>
            ))}
            <button
              onClick={() => setIsSubjectModalOpen(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-indigo-950/40 transition-colors"
            >
              <Edit3 className="w-3 h-3" /> แก้ไขวิชา
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportICS}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              title="ดาวน์โหลดไฟล์ .ics เพื่อนำเข้า Google Calendar หรือ Apple Calendar"
            >
              <Download className="w-3.5 h-3.5" /> Export Calendar (.ics)
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              {copyFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> คัดลอก Markdown แล้ว!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" /> คัดลอกตาราง
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Constraints & Generator Accordion / Control Box */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">เงื่อนไขและข้อจำกัดการอ่าน (Constraints)</h3>
          </div>
          <button
            onClick={() => onGeneratePlan({ subjects, days: totalDays, weekdayHours, weekendHours, weekdayTime, focus: focusStrategy })}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI กำลังประมวลผล...
              </span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" /> สั่ง AI วางแผนใหม่
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <label className="text-slate-400 block mb-1">ระยะเวลาเตรียมตัว (วัน)</label>
            <input
              type="number"
              min="3"
              max="60"
              value={totalDays}
              onChange={(e) => setTotalDays(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono tabular-nums focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <label className="text-slate-400 block mb-1">วันธรรมดา จันทร์–ศุกร์</label>
            <input
              type="text"
              value={weekdayTime}
              onChange={(e) => setWeekdayTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
              placeholder="19.00–22.00 น. (3 ชม.)"
            />
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <label className="text-slate-400 block mb-1">วันเสาร์–อาทิตย์ (ชั่วโมง/วัน)</label>
            <input
              type="number"
              min="1"
              max="12"
              value={weekendHours}
              onChange={(e) => setWeekendHours(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono tabular-nums focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <label className="text-slate-400 block mb-1">กลยุทธ์การเน้นลำดับ</label>
            <input
              type="text"
              value={focusStrategy}
              onChange={(e) => setFocusStrategy(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
              placeholder="วิชาที่สอบก่อน & วิชาเข้าใจยาก"
            />
          </div>
        </div>
      </div>

      {/* Iterative Prompting Section (Core Highlight from Brief) */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/30 border border-indigo-900/40 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Iterative Prompting — ปรับแผนได้ตลอดเวลา
              </h3>
              <p className="text-xs text-slate-400">
                สั่ง AI ปรับแก้ตารางเดิมแบบโต้ตอบ เช่น เพิ่มเวลาพัก ย้ายวัน หรือเน้นบทเฉพาะ
              </p>
            </div>
          </div>
          <span className="text-[11px] text-indigo-300/80">เทคนิคที่ 6: Iterative Refinement</span>
        </div>

        {/* Quick prompt suggestions from user's case */}
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            'ขอเพิ่มเวลาพักเป็น 30 นาที ทุกวัน',
            'ย้าย Theory of Computation ไปเน้นช่วงเสาร์-อาทิตย์',
            'เน้นทำโจทย์ Decision Tree เพิ่มอีก 1 คาบ',
            'ใกล้สอบแล้ว ขอเพิ่มการทำ Mock Exam ข้อสอบเก่า'
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleRefineSubmit(undefined, preset)}
              disabled={isRefining}
              className="px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs border border-slate-700/60 transition-colors flex items-center gap-1.5"
            >
              <span>+</span>
              <span>{preset}</span>
            </button>
          ))}
        </div>

        {/* Interactive refine input form */}
        <form onSubmit={handleRefineSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="พิมพ์คำสั่งให้ AI ปรับตาราง เช่น 'ขอเพิ่มเวลาพัก 15 นาที' หรือ 'สลับวิชา Database มาอ่านก่อน'..."
            value={iterativePrompt}
            onChange={(e) => setIterativePrompt(e.target.value)}
            disabled={isRefining}
            className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!iterativePrompt.trim() || isRefining}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
          >
            {isRefining ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>ส่งคำสั่งปรับปรุง</span>
          </button>
        </form>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setSelectedDayNumber('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedDayNumber === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            แสดงทั้งหมด ({plan.days.length} วัน)
          </button>
          {plan.days.map((day) => {
            const isCompleted = day.slots.every((s) => s.completed);
            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayNumber(day.dayNumber)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  selectedDayNumber === day.dayNumber
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>วันที่ {day.dayNumber}</span>
                {isCompleted && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Cards Grid / List */}
      <div className="space-y-6">
        {filteredDays.map((day) => {
          const dayAllDone = day.slots.every((s) => s.completed);
          const matchingSubject = subjects.find((s) => s.name === day.primarySubject);

          return (
            <div
              key={day.dayNumber}
              className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
                dayAllDone
                  ? 'border-emerald-500/30 shadow-lg shadow-emerald-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Day Header */}
              <div className="px-6 py-4 bg-slate-950/40 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center font-mono tabular-nums">
                    <span className="text-[10px] text-slate-400">DAY</span>
                    <span className="text-sm font-bold text-white leading-none">{day.dayNumber}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        {day.dateFormatted}
                      </h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded font-medium text-white"
                        style={{ backgroundColor: matchingSubject?.color || '#6366F1' }}
                      >
                        {day.primarySubject}
                      </span>
                    </div>
                    {/* Daily Goal as emphasized in user's prompt */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-300/90 mt-1">
                      <span className="font-semibold">🎯 เป้าหมายวันนี้:</span>
                      <span>{day.dailyGoal}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
                      dayAllDone
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {dayAllDone ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" /> ผ่านเป้าหมายแล้ว
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" /> อยู่ระหว่างดำเนินการ
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Time Slots Table */}
              <div className="divide-y divide-slate-800/60">
                {day.slots.map((slot) => {
                  const isBreak = slot.activityType === 'break';
                  const isPractice = slot.activityType === 'practice';
                  const isReview = slot.activityType === 'review';

                  return (
                    <div
                      key={slot.id}
                      className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        slot.completed
                          ? 'bg-emerald-950/10 opacity-80'
                          : isBreak
                          ? 'bg-slate-950/20'
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      {/* Left: Time & Activity */}
                      <div className="flex items-start sm:items-center gap-4">
                        <button
                          onClick={() => handleToggleSlot(day.dayNumber, slot.id)}
                          className="mt-0.5 sm:mt-0 text-slate-500 hover:text-emerald-400 transition-colors shrink-0"
                          title={slot.completed ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
                        >
                          {slot.completed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono tabular-nums text-xs font-semibold text-indigo-300">
                              {slot.time}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                                isBreak
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : isPractice
                                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                  : isReview
                                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}
                            >
                              {isBreak
                                ? '☕ พักผ่อน'
                                : isPractice
                                ? '✍️ ทำแบบฝึกหัด'
                                : isReview
                                ? '🔁 ทบทวนข้อสอบ'
                                : '📘 อ่านเนื้อหา'}
                            </span>
                            <span className="text-xs text-slate-400 font-mono tabular-nums">
                              ({slot.durationMinutes} นาที)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${slot.completed ? 'line-through text-slate-400' : 'text-white font-medium'}`}>
                              {slot.subject}: {slot.topic}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions (Focus Timer & Status) */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {!isBreak && (
                          <button
                            onClick={() => {
                              setActiveSlotForTimer(slot);
                              setIsTimerOpen(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 rounded-lg text-xs font-medium transition-colors"
                            title="เปิดนาฬิกาโฟกัส Pomodoro สำหรับคาบนี้"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>จับเวลาโฟกัส</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleSlot(day.dayNumber, slot.id)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${
                            slot.completed
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {slot.completed ? '✅ เสร็จแล้ว' : '⏳ ยังไม่เสร็จ'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Focus Timer Modal */}
      <FocusTimerModal
        slot={activeSlotForTimer}
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        onCompleteSlot={handleTimerComplete}
      />

      {/* Subject Manager Modal */}
      <SubjectManagerModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        subjects={subjects}
        onSaveSubjects={onUpdateSubjects}
      />
    </div>
  );
};
