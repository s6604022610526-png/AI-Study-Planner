import React from 'react';
import { Calendar, Sparkles, BookOpen, Presentation, CheckCircle2, RotateCcw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'planner' | 'before-after' | 'prompt-lab' | 'slides';
  setActiveTab: (tab: 'planner' | 'before-after' | 'prompt-lab' | 'slides') => void;
  onResetDemo: () => void;
  completedTasksCount: number;
  totalTasksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onResetDemo,
  completedTasksCount,
  totalTasksCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                AI Study Planner
                <span className="text-xs font-normal text-indigo-400 border border-indigo-500/30 rounded px-1.5 py-0.5">Prompt Engineering</span>
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'planner'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              ตารางอ่านหนังสือ
            </button>
            <button
              onClick={() => setActiveTab('before-after')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'before-after'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Before vs After
            </button>
            <button
              onClick={() => setActiveTab('prompt-lab')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'prompt-lab'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Prompt Lab
            </button>
            <button
              onClick={() => setActiveTab('slides')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'slides'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              สไลด์สรุปผลงาน
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-mono tabular-nums text-slate-200">{completedTasksCount}/{totalTasksCount}</span>
              <span>เสร็จแล้ว</span>
            </div>

            <button
              onClick={onResetDemo}
              title="โหลดข้อมูลตัวอย่างเริ่มต้น (Data Mining, TOC, SE, Database)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">รีเซ็ต</span>ตัวอย่าง KMUTNB
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800/80 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'planner' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            ตารางอ่านหนังสือ
          </button>
          <button
            onClick={() => setActiveTab('before-after')}
            className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'before-after' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Before vs After
          </button>
          <button
            onClick={() => setActiveTab('prompt-lab')}
            className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'prompt-lab' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Prompt Lab
          </button>
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === 'slides' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            สไลด์สรุป
          </button>
        </div>
      </div>
    </header>
  );
};
