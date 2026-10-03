export type ActivityType = 'study' | 'break' | 'practice' | 'review';

export interface SubjectItem {
  id: string;
  name: string;
  difficulty: 'ง่าย' | 'ปานกลาง' | 'ยาก' | 'ยากมาก';
  examInDays: number;
  topics: string;
  color?: string;
}

export interface StudySlot {
  id: string;
  time: string; // e.g., "19.00–20.30 น."
  activityType: ActivityType;
  subject: string;
  topic: string;
  durationMinutes: number;
  completed: boolean;
}

export interface DayPlan {
  dayNumber: number;
  dateFormatted: string; // e.g. "วันจันทร์ที่ 3 ต.ค."
  dailyGoal: string;
  primarySubject: string;
  slots: StudySlot[];
  status: 'pending' | 'in_progress' | 'completed';
}

export interface StudyPlan {
  meta: {
    generatedAt: string;
    source: string;
    totalDays: number;
    summary: string;
  };
  days: DayPlan[];
}

export interface PromptComponent {
  id: string;
  title: string;
  technique: string;
  badge: string;
  description: string;
  beforeSnippet: string;
  afterSnippet: string;
  whyItMatters: string;
}
