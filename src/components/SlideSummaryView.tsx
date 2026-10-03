import React, { useState } from 'react';
import {
  Presentation,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Share2
} from 'lucide-react';

export const SlideSummaryView: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const slides = [
    {
      id: 'slide-1',
      slideNumber: 1,
      tag: 'Prompt Engineering',
      title: 'Prompt & Techniques',
      subtitle: '5 เสาหลัก + 1 เทคนิคการออกแบบ Prompt สำหรับ AI Study Planner',
      points: [
        {
          label: 'Role Prompting',
          desc: 'กำหนดบทบาท AI ให้เป็น "AI Study Planner" เพื่อดึงชุดความเชี่ยวชาญการวางแผนการเรียน'
        },
        {
          label: 'Context',
          desc: 'ให้ข้อมูลผู้ใช้ครบถ้วน: รายวิชาที่สอบ (4 วิชา), กำหนดวันสอบ (14 วัน)'
        },
        {
          label: 'Constraint',
          desc: 'กำหนดข้อจำกัดด้านเวลา: วันธรรมดา 19.00–22.00 น. (3 ชม.) และวันหยุด 5 ชม.'
        },
        {
          label: 'Output Format',
          desc: 'กำหนดรูปแบบผลลัพธ์เป็นตารางรายวัน มีช่วงเวลาชัดเจน เป้าหมายรายวัน และสถานะ'
        },
        {
          label: 'Iterative Prompting',
          desc: 'ปรับ Prompt แบบวนซ้ำเพื่อขัดเกลาผลลัพธ์ตามฟีดแบ็กจริงของผู้เรียน'
        }
      ]
    },
    {
      id: 'slide-2',
      slideNumber: 2,
      tag: 'Impact Comparison',
      title: 'Before vs After Comparison',
      subtitle: 'ความแตกต่างของผลลัพธ์ก่อนและหลังประยุกต์ใช้เทคนิค Prompt',
      points: [
        {
          label: 'ก่อนปรับ Prompt (Before)',
          desc: 'ได้แผนการอ่านแบบทั่วไป หยาบ ไม่ระบุเวลา ไม่บอกหัวข้อย่อย ไม่มีช่วงพัก และนำไปปฏิบัติจริงไม่ได้'
        },
        {
          label: 'หลังปรับ Prompt (After)',
          desc: 'ได้แผนที่ละเอียดตรงกับวิชา เวลาว่าง และวันสอบจริง มีช่วงเวลาชัดเจน (เช่น 19.00–20.30 น. Data Mining: Decision Tree)'
        },
        {
          label: 'เวลาพักและการฝึกปฏิบัติ',
          desc: 'มีช่วงพักเบรก 15 นาที และจัดเวลาทำแบบฝึกหัด (Practice Session) ทุกวัน ป้องกันความเหนื่อยล้า'
        },
        {
          label: 'เป้าหมายที่วัดผลได้ (Daily Goal)',
          desc: 'ทุกวันมีเป้าหมายการเรียนรู้ที่ชัดเจน เช่น "เข้าใจ Decision Tree และทำโจทย์ได้"'
        }
      ]
    },
    {
      id: 'slide-3',
      slideNumber: 3,
      tag: 'System Capabilities',
      title: 'Final Product: AI Study Planner',
      subtitle: 'ระบบวางแผนการอ่านหนังสืออัจฉริยะที่พร้อมใช้งานจริง',
      points: [
        {
          label: 'รับข้อมูลการเรียนจากผู้ใช้',
          desc: 'กรอกรายวิชา วันสอบ เวลาว่างในแต่ละวัน และระดับความยากของแต่ละวิชา'
        },
        {
          label: 'AI วิเคราะห์และจัดลำดับความสำคัญ',
          desc: 'ให้น้ำหนักวิชาที่สอบก่อนและวิชาที่เข้าใจยากเป็นอันดับแรก'
        },
        {
          label: 'สร้างตารางอ่านหนังสือรายวัน',
          desc: 'แจกแจงคาบเรียน ช่วงเวลา และหัวข้อย่อยรายวันอย่างเป็นรูปธรรม'
        },
        {
          label: 'มีเวลาพัก ทบทวน และทำแบบฝึกหัด',
          desc: 'จัดสรรเวลาอย่างสมดุลตามหลัก Cognitive Load Theory และ Pomodoro Technique'
        },
        {
          label: 'สามารถปรับแผนตามความต้องการของผู้ใช้ได้',
          desc: 'มีระบบ Iterative Prompting ปรับตารางตามคำขอแบบ Real-time'
        }
      ]
    }
  ];

  const handleCopySlide = (slide: typeof slides[0]) => {
    const text = `📌 ${slide.title}\n${slide.subtitle}\n\n` +
      slide.points.map((p) => `• ${p.label}: ${p.desc}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedKey(slide.id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAllSlides = () => {
    const allText = `# สรุปสำหรับใส่สไลด์ (AI Study Planner)\n\n` +
      slides.map((s) => `## ${s.slideNumber}. ${s.title}\n${s.subtitle}\n\n` +
        s.points.map((p) => `• **${p.label}**: ${p.desc}`).join('\n')
      ).join('\n\n---\n\n');

    navigator.clipboard.writeText(allText);
    setCopiedKey('all');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1.5">
                <Presentation className="w-3.5 h-3.5" />
                Presentation Ready
              </span>
              <span className="text-xs text-slate-400">· พร้อมคัดลอกลง PowerPoint / Canva</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              สรุปสำหรับใส่สไลด์แบบสั้น
            </h1>
            <p className="text-sm text-slate-400">
              ข้อความสรุปกระชับ 3 สไลด์หลัก ตรงตามเกณฑ์นำเสนอผลงาน สามารถกดคัดลอกไปทำสไลด์หรือพรีเซนต์ได้ทันที
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAllSlides}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow-sm transition-colors whitespace-nowrap"
            >
              {copiedKey === 'all' ? (
                <>
                  <Check className="w-3.5 h-3.5" /> คัดลอกทั้ง 3 สไลด์แล้ว!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> คัดลอกทั้ง 3 สไลด์
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Slide Carousel Deck */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Slide Header Toolbar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold">
              SLIDE {currentSlide.slideNumber} / {slides.length}
            </span>
            <span className="text-xs text-slate-400">· {currentSlide.tag}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopySlide(currentSlide)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              {copiedKey === currentSlide.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> คัดลอกแล้ว
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> คัดลอกสไลด์นี้
                </>
              )}
            </button>
          </div>
        </div>

        {/* Slide Content Body */}
        <div className="py-8 sm:py-12 relative z-10 space-y-6">
          <div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              {currentSlide.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              {currentSlide.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {currentSlide.points.map((point, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{point.label}</span>
                </div>
                <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800 relative z-10">
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlideIndex === idx ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
                title={`ไปที่สไลด์ ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-lg transition-colors"
              title="สไลด์ก่อนหน้า"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-lg transition-colors"
              title="สไลด์ถัดไป"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of All 3 Slides for Quick Reference */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          ภาพรวมทั้ง 3 สไลด์ (All Slides Overview)
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                currentSlideIndex === idx
                  ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-400">SLIDE 0{slide.slideNumber}</span>
                  <span className="text-[10px] text-slate-400 uppercase">{slide.tag}</span>
                </div>
                <h4 className="text-base font-bold text-white">{slide.title}</h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  {slide.points.slice(0, 3).map((pt, pIdx) => (
                    <li key={pIdx} className="line-clamp-2">
                      <strong className="text-slate-200">{pt.label}:</strong> {pt.desc}
                    </li>
                  ))}
                  {slide.points.length > 3 && (
                    <li className="text-indigo-400 font-medium">+{slide.points.length - 3} ข้อเพิ่มเติม...</li>
                  )}
                </ul>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>คลิกเพื่อดูสไลด์นี้</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
