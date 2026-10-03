import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlannerView } from './components/PlannerView';
import { BeforeAfterView } from './components/BeforeAfterView';
import { PromptLabView } from './components/PromptLabView';
import { SlideSummaryView } from './components/SlideSummaryView';
import { INITIAL_SUBJECTS, INITIAL_STUDY_PLAN } from './data/defaultData';
import { StudyPlan, SubjectItem } from './types';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<'planner' | 'before-after' | 'prompt-lab' | 'slides'>('planner');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage or defaults
  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    try {
      const saved = localStorage.getItem('ai_study_subjects');
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [plan, setPlan] = useState<StudyPlan>(() => {
    try {
      const saved = localStorage.getItem('ai_study_plan');
      return saved ? JSON.parse(saved) : INITIAL_STUDY_PLAN;
    } catch {
      return INITIAL_STUDY_PLAN;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_study_subjects', JSON.stringify(subjects));
    } catch (e) {
      console.error(e);
    }
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_study_plan', JSON.stringify(plan));
    } catch (e) {
      console.error(e);
    }
  }, [plan]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset to initial KMUTNB demo
  const handleResetDemo = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลกลับเป็นตัวอย่างเริ่มต้น (4 วิชา KMUTNB) ใช่หรือไม่?')) {
      setSubjects(INITIAL_SUBJECTS);
      setPlan(INITIAL_STUDY_PLAN);
      showToast('รีเซ็ตข้อมูลตัวอย่าง 4 วิชาสำเร็จแล้ว!');
      confetti({ particleCount: 40, spread: 40 });
    }
  };

  // API Call: Generate Plan
  const handleGeneratePlan = async (params: {
    subjects: SubjectItem[];
    days: number;
    weekdayHours: number;
    weekendHours: number;
    weekdayTime: string;
    focus: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setPlan(data.plan);
        showToast(data.isLiveAI ? 'สร้างตารางสำเร็จด้วย Gemini 3.8 Flash!' : 'สร้างตารางสำเร็จด้วยระบบวางแผนอัจฉริยะ');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } else {
        showToast('เกิดข้อผิดพลาดในการสร้างตาราง กรุณาลองใหม่อีกครั้ง');
      }
    } catch (err: any) {
      showToast(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // API Call: Refine Plan (Iterative Prompting)
  const handleRefinePlan = async (instruction: string) => {
    try {
      const res = await fetch('/api/plan/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPlan: plan, instruction }),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setPlan(data.plan);
        showToast(data.refinementSummary || 'ปรับปรุงตารางตามคำขอเรียบร้อยแล้ว!');
        confetti({ particleCount: 60, spread: 50 });
      } else {
        showToast('ไม่สามารถปรับปรุงตารางได้');
      }
    } catch (err: any) {
      showToast(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  // Completed tasks count
  const totalTasks = plan.days.reduce((acc, d) => acc + d.slots.length, 0);
  const completedTasks = plan.days.reduce((acc, d) => acc + d.slots.filter((s) => s.completed).length, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/40 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemo}
        completedTasksCount={completedTasks}
        totalTasksCount={totalTasks}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'planner' && (
          <PlannerView
            plan={plan}
            subjects={subjects}
            onUpdatePlan={setPlan}
            onUpdateSubjects={setSubjects}
            isLoading={isLoading}
            onGeneratePlan={handleGeneratePlan}
            onRefinePlan={handleRefinePlan}
          />
        )}

        {activeTab === 'before-after' && <BeforeAfterView />}

        {activeTab === 'prompt-lab' && <PromptLabView />}

        {activeTab === 'slides' && <SlideSummaryView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">AI Study Planner</span>
            <span>·</span>
            <span>ขับเคลื่อนด้วย Prompt Engineering & Google Gemini</span>
          </div>
          <div className="text-slate-400">
            วิชา: Data Mining · TOC · SE · Database
          </div>
        </div>
      </footer>
    </div>
  );
}
