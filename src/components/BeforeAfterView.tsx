import React, { useState } from 'react';
import {
  BEFORE_PROMPT,
  AFTER_PROMPT,
  BEFORE_RESULT,
  AFTER_RESULT_HIGHLIGHTS,
  PROMPT_TECHNIQUES
} from '../data/defaultData';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Layers,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export const BeforeAfterView: React.FC = () => {
  const [activeTechnique, setActiveTechnique] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<'before' | 'after' | null>(null);

  const handleCopy = (text: string, type: 'before' | 'after') => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(type);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              Prompt Engineering Case Study
            </span>
            <span className="text-xs text-slate-400">· ก่อนและหลังการปรับปรุง</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            ตัวอย่าง Prompt ที่สำคัญ และเทคนิคที่ใช้
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            เปรียบเทียบผลลัพธ์จากการใช้ Prompt ธรรมดาทั่วไป กับ Prompt ที่ประยุกต์ใช้เทคนิคทั้ง 6 ด้าน เพื่อเปลี่ยนผลลัพธ์จากตารางคร่าวๆ ที่นำไปใช้จริงไม่ได้ สู่แผนการอ่านหนังสือรายวันที่ใช้งานได้ทันที
          </p>
        </div>
      </div>

      {/* Side-by-side Prompts Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BEFORE PROMPT */}
        <div className="bg-slate-900/80 border border-rose-900/30 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500/50" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                <span className="text-sm font-bold text-rose-300">Prompt เริ่มต้น (ก่อนปรับปรุง)</span>
              </div>
              <button
                onClick={() => handleCopy(BEFORE_PROMPT, 'before')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800"
              >
                {copiedPrompt === 'before' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                คัดลอก
              </button>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {BEFORE_PROMPT}
            </div>

            <div className="mt-4 p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-1.5 text-xs text-rose-300/90">
              <span className="font-semibold flex items-center gap-1">
                ⚠️ ปัญหาที่พบ:
              </span>
              <p className="text-slate-400 leading-relaxed">
                ผลลัพธ์ที่ได้มักเป็นตารางทั่วไป เพราะไม่ได้ระบุข้อมูลวิชา วันสอบ ข้อจำกัดด้านเวลา และเงื่อนไขที่ชัดเจน
              </p>
            </div>
          </div>

          {/* Before Result Preview */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              ตัวอย่างผลลัพธ์ที่ได้ (ก่อนปรับ Prompt)
            </span>
            <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs font-mono text-slate-400 space-y-1">
              <div>· อ่าน Data Mining วันจันทร์</div>
              <div>· อ่าน Database วันอังคาร</div>
              <div>· อ่าน Software Engineering วันพุธ</div>
              <div>· อ่าน Theory of Computation วันพฤหัสบดี</div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              * ขาดการระบุเวลา, ไม่มีเวลาพัก, ไม่บอกว่าควรอ่านหัวข้อไหน และไม่ได้แบ่งช่วงทำโจทย์
            </p>
          </div>
        </div>

        {/* AFTER PROMPT */}
        <div className="bg-slate-900/80 border border-emerald-900/30 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/50" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-300">Prompt ที่ปรับปรุงแล้ว (หลังประยุกต์ใช้เทคนิค)</span>
              </div>
              <button
                onClick={() => handleCopy(AFTER_PROMPT, 'after')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800"
              >
                {copiedPrompt === 'after' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                คัดลอก
              </button>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {AFTER_PROMPT}
            </div>

            <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-1.5 text-xs text-emerald-300/90">
              <span className="font-semibold flex items-center gap-1">
                ✨ จุดเด่นที่ปรับปรุง:
              </span>
              <p className="text-slate-300 leading-relaxed">
                ระบุ Role ชัดเจน, กำหนด Context วิชา วันสอบ และ Constraint เวลาอ่าน จ-ศ กับ ส-อา พร้อมสั่งให้ออกผลลัพธ์เป็นตารางที่มีเวลาพักและแบบฝึกหัด
              </p>
            </div>
          </div>

          {/* After Result Preview */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
              ตัวอย่างผลลัพธ์ที่ได้ (หลังปรับ Prompt)
            </span>
            <div className="space-y-3">
              {AFTER_RESULT_HIGHLIGHTS.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs space-y-1.5">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>{item.day}</span>
                    <span className="text-[11px] text-amber-400 font-normal">เป้าหมาย: {item.goal}</span>
                  </div>
                  {item.schedule.map((slot, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
                      <span className="text-indigo-400 tabular-nums">{slot.time}</span>
                      <span>—</span>
                      <span className={slot.type === 'break' ? 'text-amber-400' : slot.type === 'practice' ? 'text-purple-300' : 'text-slate-200'}>
                        {slot.text}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-2">
              * ละเอียด ตรงกับข้อจำกัดของผู้ใช้จริง สามารถนำไปใช้เป็นแผนการอ่านหนังสือจริงได้ทันที
            </p>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-900/40 rounded-2xl flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">
            สรุปหัวใจสำคัญ: ทำไม Prompt ที่ปรับปรุงแล้วจึงดีกว่า 10 เท่า?
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            หลังปรับ Prompt ผลลัพธ์มีรายละเอียดและตรงกับข้อจำกัดของผู้ใช้มากขึ้น สามารถนำไปใช้เป็นแผนการอ่านหนังสือจริงได้ AI จะไม่ตอบแบบเดาสุ่มเพราะมีกรอบที่ชัดเจน (Guardrails & Constraints) และช่วยลด Cognitive Load ของผู้เรียนโดยตรง
          </p>
        </div>
      </div>

      {/* 6 Core Prompt Techniques Breakdown Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              เจาะลึก 6 เทคนิค Prompt Engineering ที่ใช้ในงานนี้
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              คลิกที่แต่ละการ์ดเพื่อดูตัวอย่างและผลกระทบต่อคำตอบของ AI
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROMPT_TECHNIQUES.map((tech, idx) => {
            const isSelected = activeTechnique === tech.id;
            return (
              <div
                key={tech.id}
                onClick={() => setActiveTechnique(isSelected ? null : tech.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-950/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-indigo-400">
                    เทคนิค 0{idx + 1}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {tech.name}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5">
                  {tech.thaiName}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {tech.description}
                </p>

                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs font-mono text-slate-300 mb-2">
                  <span className="text-indigo-400 block text-[10px] uppercase font-semibold mb-1">ตัวอย่างใน Prompt:</span>
                  {tech.example}
                </div>

                <div className="text-[11px] text-emerald-400/90 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{tech.impact}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
