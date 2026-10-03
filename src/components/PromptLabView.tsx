import React, { useState } from 'react';
import { Sparkles, Play, Copy, Check, RotateCcw, Send, Terminal, BookOpen } from 'lucide-react';

export const PromptLabView: React.FC = () => {
  const [roleText, setRoleText] = useState(
    'คุณคือ AI Study Planner ช่วยวางแผนการอ่านหนังสือสำหรับนักศึกษามหาวิทยาลัย โดยมีข้อมูลดังนี้'
  );
  const [contextText, setContextText] = useState(
    'วิชา: Data Mining, Software Engineering, Theory of Computation และ Database\nสอบในอีก 14 วัน'
  );
  const [constraintText, setConstraintText] = useState(
    'มีเวลาอ่านวันละ 3 ชั่วโมง\nวันจันทร์–ศุกร์ อ่านได้เวลา 19.00–22.00 น.\nวันเสาร์–อาทิตย์ อ่านได้วันละ 5 ชั่วโมง\nต้องการเน้นวิชาที่สอบก่อนและวิชาที่เข้าใจยาก'
  );
  const [taskText, setTaskText] = useState(
    'กรุณาจัดตารางอ่านหนังสือเป็นรายวัน พร้อมระบุวิชา หัวข้อที่ต้องอ่าน ระยะเวลา และเวลาพัก โดยให้มีวันทบทวนและทำแบบฝึกหัดก่อนสอบด้วย'
  );
  const [formatText, setFormatText] = useState(
    'ให้แสดงผลเป็นตารางรายวัน มีเป้าหมายประจำวัน (Daily Goal) และมีช่องเช็คสถานะ เสร็จแล้ว / ยังไม่เสร็จ'
  );

  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Assemble full prompt
  const assembledPrompt = `${roleText}\n\n${contextText}\n${constraintText}\n\n${taskText}\n${formatText}`;

  const handleRunTest = async () => {
    setIsRunning(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/prompt/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: assembledPrompt })
      });
      const data = await res.json();
      setTestResult(data.result || 'ไม่สามารถรับผลลัพธ์ได้');
    } catch (err: any) {
      setTestResult(`เกิดข้อผิดพลาด: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(assembledPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleResetToDefault = () => {
    setRoleText('คุณคือ AI Study Planner ช่วยวางแผนการอ่านหนังสือสำหรับนักศึกษามหาวิทยาลัย โดยมีข้อมูลดังนี้');
    setContextText('วิชา: Data Mining, Software Engineering, Theory of Computation และ Database\nสอบในอีก 14 วัน');
    setConstraintText('มีเวลาอ่านวันละ 3 ชั่วโมง\nวันจันทร์–ศุกร์ อ่านได้เวลา 19.00–22.00 น.\nวันเสาร์–อาทิตย์ อ่านได้วันละ 5 ชั่วโมง\nต้องการเน้นวิชาที่สอบก่อนและวิชาที่เข้าใจยาก');
    setTaskText('กรุณาจัดตารางอ่านหนังสือเป็นรายวัน พร้อมระบุวิชา หัวข้อที่ต้องอ่าน ระยะเวลา และเวลาพัก โดยให้มีวันทบทวนและทำแบบฝึกหัดก่อนสอบด้วย');
    setFormatText('ให้แสดงผลเป็นตารางรายวัน มีเป้าหมายประจำวัน (Daily Goal) และมีช่องเช็คสถานะ เสร็จแล้ว / ยังไม่เสร็จ');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Prompt Construction Studio
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Prompt Engineering Lab
            </h1>
            <p className="text-sm text-slate-400">
              ทดลองประกอบและปรับแต่งชิ้นส่วน Prompt ตามหลักวิชาการ แล้วทดสอบรันกับ Gemini 3.8 Flash สดๆ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> รีเซ็ตค่ามาตรฐาน
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              คัดลอก Prompt
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Component Builders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              ชิ้นส่วนประกอบ Prompt (Prompt Components)
            </h3>
          </div>

          {/* 1. Role Prompting */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                1. Role Prompting (กำหนดบทบาท)
              </label>
              <span className="text-[10px] text-slate-500">สร้างความเชี่ยวชาญเฉพาะด้าน</span>
            </div>
            <textarea
              rows={2}
              value={roleText}
              onChange={(e) => setRoleText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* 2. Context */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                2. Context (ข้อมูลวิชา & กำหนดวันสอบ)
              </label>
              <span className="text-[10px] text-slate-500">ข้อมูลแวดล้อมที่จำเป็น</span>
            </div>
            <textarea
              rows={2}
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          {/* 3. Constraint */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                3. Constraint (ข้อจำกัดเวลา & ลำดับความสำคัญ)
              </label>
              <span className="text-[10px] text-slate-500">กรอบเวลาที่ใช้จริง</span>
            </div>
            <textarea
              rows={3}
              value={constraintText}
              onChange={(e) => setConstraintText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          {/* 4. Task Specification */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                4. Task Specification (ขอบเขตงานที่ต้องการ)
              </label>
              <span className="text-[10px] text-slate-500">ระบุหัวข้อ พัก ทบทวน และแบบฝึกหัด</span>
            </div>
            <textarea
              rows={2}
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          {/* 5. Output Format */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                5. Output Format (รูปแบบผลลัพธ์)
              </label>
              <span className="text-[10px] text-slate-500">ตารางรายวัน เป้าหมาย และสถานะ</span>
            </div>
            <textarea
              rows={2}
              value={formatText}
              onChange={(e) => setFormatText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Right: Live Assembled Prompt Preview & Test Runner */}
        <div className="space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Prompt รวมฉบับเต็ม (Full Assembled Prompt)
            </h3>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {assembledPrompt.length} ตัวอักษร
            </span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed flex-1 max-h-[360px] overflow-y-auto">
            {assembledPrompt}
          </div>

          <button
            onClick={handleRunTest}
            disabled={isRunning}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
          >
            {isRunning ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                กำลังส่ง Prompt ไปประมวลผลที่ Gemini 3.8 Flash...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> ทดสอบรันกับ Gemini 3.8 Flash
              </>
            )}
          </button>

          {/* Test Execution Output */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                ผลลัพธ์จาก AI (Live Output):
              </span>
              {testResult && (
                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  สำเร็จ
                </span>
              )}
            </div>

            <div className="flex-1 bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {isRunning ? (
                <div className="flex items-center gap-2 text-indigo-400 py-4">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  <span>AI กำลังวิเคราะห์และจัดตารางเวลา...</span>
                </div>
              ) : testResult ? (
                testResult
              ) : (
                <span className="text-slate-600 italic">
                  กดปุ่ม "ทดสอบรันกับ Gemini 3.8 Flash" ด้านบนเพื่อดูคำตอบจริงจาก AI ที่ผ่านการประยุกต์ใช้ 5 เทคนิค
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
