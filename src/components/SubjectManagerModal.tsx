import React, { useState } from 'react';
import { X, Plus, Trash2, BookOpen, AlertCircle } from 'lucide-react';
import { SubjectItem } from '../types';

interface SubjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectItem[];
  onSaveSubjects: (newSubjects: SubjectItem[]) => void;
}

const PRESET_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];

export const SubjectManagerModal: React.FC<SubjectManagerModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onSaveSubjects,
}) => {
  const [items, setItems] = useState<SubjectItem[]>(subjects);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'ง่าย' | 'ปานกลาง' | 'ยาก' | 'ยากมาก'>('ปานกลาง');
  const [newExamInDays, setNewExamInDays] = useState(14);
  const [newTopics, setNewTopics] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const newItem: SubjectItem = {
      id: `subj-${Date.now()}`,
      name: newSubjectName.trim(),
      difficulty: newDifficulty,
      examInDays: Number(newExamInDays) || 14,
      topics: newTopics.trim() || 'ทบทวนเนื้อหาและทำแบบฝึกหัด',
      color: PRESET_COLORS[items.length % PRESET_COLORS.length]
    };

    setItems([...items, newItem]);
    setNewSubjectName('');
    setNewTopics('');
    setNewExamInDays(14);
  };

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (items.length === 0) {
      alert('กรุณามีอย่างน้อย 1 รายวิชา');
      return;
    }
    onSaveSubjects(items);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              จัดการรายวิชาที่ต้องสอบ
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              กำหนดวิชา วันสอบ ระดับความยาก เพื่อให้ AI คำนวณน้ำหนักการจัดตาราง
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {items.map((sub, idx) => (
            <div
              key={sub.id}
              className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-start justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: sub.color || '#6366F1' }}
                  />
                  <span className="text-sm font-semibold text-white">{sub.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-700/60 text-slate-300">
                    ความยาก: {sub.difficulty}
                  </span>
                  <span className="text-xs text-amber-400 font-mono tabular-nums">
                    สอบในอีก {sub.examInDays} วัน
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 truncate">
                  หัวข้อ: {sub.topics || 'ทบทวนทั่วไป'}
                </p>
              </div>
              <button
                onClick={() => handleRemove(sub.id)}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                title="ลบวิชานี้"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Form to add new subject */}
          <form onSubmit={handleAdd} className="mt-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              + เพิ่มวิชาใหม่
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">ชื่อวิชา</label>
                <input
                  type="text"
                  placeholder="เช่น Artificial Intelligence"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">ระดับความยาก</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="ง่าย">ง่าย</option>
                  <option value="ปานกลาง">ปานกลาง</option>
                  <option value="ยาก">ยาก</option>
                  <option value="ยากมาก">ยากมาก (จัดอ่านก่อน/เน้นทำโจทย์)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">สอบในอีก (วัน)</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={newExamInDays}
                  onChange={(e) => setNewExamInDays(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono tabular-nums"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 block mb-1">หัวข้อที่ต้องเน้น / เนื้อหาย่อย</label>
                <input
                  type="text"
                  placeholder="เช่น A* Search, Minimax, Heuristics"
                  value={newTopics}
                  onChange={(e) => setNewTopics(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!newSubjectName.trim()}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> เพิ่มลงในรายการ
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0">
          <span className="text-xs text-slate-400">
            ทั้งหมด {items.length} วิชา
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              บันทึกและนำไปใช้
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
