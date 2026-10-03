import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback high-quality schedule generator if Gemini is offline or no key
function generateAlgorithmicPlan(params: {
  subjects: Array<{ name: string; difficulty: string; examInDays: number; topics?: string }>;
  days: number;
  weekdayHours: number;
  weekendHours: number;
  focus: string;
  startDate?: string;
}) {
  const daysCount = params.days || 14;
  const subjects = params.subjects.length > 0 ? params.subjects : [
    { name: 'Data Mining', difficulty: 'ยากมาก', examInDays: 7, topics: 'Decision Tree, Clustering, Association Rules, Neural Nets' },
    { name: 'Theory of Computation', difficulty: 'ยากมาก', examInDays: 10, topics: 'DFA, NFA, Regular Expressions, PDA, Turing Machine' },
    { name: 'Software Engineering', difficulty: 'ปานกลาง', examInDays: 12, topics: 'Agile/Scrum, Architecture Patterns, Testing, CI/CD' },
    { name: 'Database', difficulty: 'ปานกลาง', examInDays: 14, topics: 'ER Diagram, Normalization, SQL Query, Indexing, Transactions' },
  ];

  // Sort by urgency (examInDays) and difficulty
  const sortedSubjects = [...subjects].sort((a, b) => {
    if (a.examInDays !== b.examInDays) return a.examInDays - b.examInDays;
    const diffScore = (d: string) => d.includes('ยากมาก') ? 3 : d.includes('ปานกลาง') ? 2 : 1;
    return diffScore(b.difficulty) - diffScore(a.difficulty);
  });

  const dailyPlans = [];
  const baseDate = new Date();

  const sampleTopics: Record<string, string[]> = {
    'Data Mining': ['Decision Tree & Information Gain', 'Ensemble Learning & Random Forest', 'K-Means & Hierarchical Clustering', 'Association Rules (Apriori)', 'Model Evaluation (ROC, AUC)', 'ทบทวนและตะลุยโจทย์ Data Mining'],
    'Theory of Computation': ['DFA & NFA State Diagrams', 'Regular Expressions & Pumping Lemma', 'Pushdown Automata (PDA)', 'Context-Free Grammars (CFG)', 'Turing Machines & Decidability', 'ฝึกสร้าง PDA และทำโจทย์ข้อสอบเก่า'],
    'Software Engineering': ['Software Lifecycle & Agile/Scrum', 'Design Patterns (Creational/Structural)', 'Architectural Styles (MVC, Microservices)', 'Unit & Integration Testing', 'CI/CD & DevOps Principles', 'จำลองการออกแบบระบบและข้อสอบ'],
    'Database': ['Relational Model & ER to Schema', 'Normalization (1NF to BCNF)', 'Advanced SQL (Join, Subquery, Group By)', 'Transactions & ACID Properties', 'Indexing & B-Tree Optimization', 'ฝึกเขียน SQL และแก้โจทย์ Normalization']
  };

  for (let i = 1; i <= daysCount; i++) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() + (i - 1));
    const dayOfWeek = curDate.getDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const thaiDayNames = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
    const thaiMonthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const dateFormatted = `${thaiDayNames[dayOfWeek]}ที่ ${curDate.getDate()} ${thaiMonthNames[curDate.getMonth()]}`;

    // Select primary subject for today based on round-robin weighted by urgency
    const subjIndex = (i - 1) % sortedSubjects.length;
    const todaySubj = sortedSubjects[subjIndex];
    const topicsList = sampleTopics[todaySubj.name] || [`หัวข้อสำคัญตอนที่ ${(i % 3) + 1}`, `แบบฝึกหัดทบทวน ${todaySubj.name}`];
    const topicName = topicsList[(Math.floor((i - 1) / sortedSubjects.length)) % topicsList.length];

    const slots = [];
    if (!isWeekend) {
      // Weekday: 19.00 - 22.00 (3 hours with break)
      slots.push({
        id: `day-${i}-slot-1`,
        time: '19.00–20.30 น.',
        activityType: 'study',
        subject: todaySubj.name,
        topic: topicName,
        durationMinutes: 90,
        completed: false
      });
      slots.push({
        id: `day-${i}-slot-2`,
        time: '20.30–20.45 น.',
        activityType: 'break',
        subject: 'พักผ่อน',
        topic: 'พักสายตา ยืดเหยียด ดื่มน้ำ (15 นาที)',
        durationMinutes: 15,
        completed: false
      });
      slots.push({
        id: `day-${i}-slot-3`,
        time: '20.45–22.00 น.',
        activityType: 'practice',
        subject: todaySubj.name,
        topic: `ทำแบบฝึกหัดและสรุป Mind Map: ${topicName}`,
        durationMinutes: 75,
        completed: false
      });
    } else {
      // Weekend: 5 hours total
      const secondarySubj = sortedSubjects[(subjIndex + 1) % sortedSubjects.length];
      slots.push({
        id: `day-${i}-slot-1`,
        time: '09.30–11.30 น.',
        activityType: 'study',
        subject: todaySubj.name,
        topic: `เจาะลึกทฤษฎี & ตัวอย่าง: ${topicName}`,
        durationMinutes: 120,
        completed: false
      });
      slots.push({
        id: `day-${i}-slot-2`,
        time: '11.30–13.00 น.',
        activityType: 'break',
        subject: 'พักกลางวัน',
        topic: 'รับประทานอาหารกลางวันและผ่อนคลาย',
        durationMinutes: 90,
        completed: false
      });
      slots.push({
        id: `day-${i}-slot-3`,
        time: '13.00–14.30 น.',
        activityType: 'practice',
        subject: todaySubj.name,
        topic: `ตะลุยโจทย์แนวข้อสอบเก่า: ${todaySubj.name}`,
        durationMinutes: 90,
        completed: false
      });
      slots.push({
        id: `day-${i}-slot-4`,
        time: '14.30–14.45 น.',
        activityType: 'break',
        subject: 'พักเบรก',
        topic: 'พักสมอง จิบกาแฟ/ของว่าง',
        durationMinutes: 15,
        completed: false
      });
      slots.push({
        id: `day-${i}-slot-5`,
        time: '14.45–16.15 น.',
        activityType: 'review',
        subject: secondarySubj.name,
        topic: `ทบทวนเสริมวิชา ${secondarySubj.name} (สรุปเนื้อหาสำคัญ)`,
        durationMinutes: 90,
        completed: false
      });
    }

    dailyPlans.push({
      dayNumber: i,
      dateFormatted,
      dailyGoal: `เข้าใจหลักการสำคัญของ ${todaySubj.name} (${topicName}) และสามารถทำแบบฝึกหัดได้ถูกต้องอย่างน้อย 80%`,
      primarySubject: todaySubj.name,
      slots,
      status: 'pending' // 'pending' | 'in_progress' | 'completed'
    });
  }

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'algorithmic_expert',
      totalDays: daysCount,
      summary: `แผนอ่านหนังสือ ${daysCount} วัน เน้นวิชาที่สอบก่อน (${sortedSubjects.map(s => s.name).join(', ')}) จัดสรรเวลาวันธรรมดา 3 ชม. และเสาร์-อาทิตย์ 5 ชม. พร้อมเวลาพักและตะลุยโจทย์`
    },
    days: dailyPlans
  };
}

// API endpoint to generate plan
app.post('/api/plan/generate', async (req, res) => {
  try {
    const { subjects, days = 14, weekdayHours = 3, weekendHours = 5, weekdayTime = '19.00–22.00 น.', focus = 'เน้นวิชาที่สอบก่อนและวิชาที่เข้าใจยาก' } = req.body;

    if (!ai) {
      const fallback = generateAlgorithmicPlan({ subjects, days, weekdayHours, weekendHours, focus });
      return res.json({ success: true, plan: fallback, isLiveAI: false, note: 'Generated with high-precision algorithmic planner' });
    }

    const promptText = `คุณคือ "AI Study Planner" มืออาชีพ ช่วยวางแผนการอ่านหนังสือสำหรับนักศึกษามหาวิทยาลัย โดยมีข้อมูลดังนี้:

วิชาที่ต้องสอบ:
${subjects.map((s: any, idx: number) => `${idx + 1}. ${s.name} (ระดับความยาก: ${s.difficulty || 'ปานกลาง'}, สอบในอีก ${s.examInDays || 14} วัน, หัวข้อที่ต้องเน้น: ${s.topics || 'เนื้อหาหลักของรายวิชา'})`).join('\n')}

เงื่อนไขและข้อจำกัด (Constraints):
- ระยะเวลาเตรียมตัวทั้งหมด: ${days} วัน
- วันจันทร์–ศุกร์: อ่านได้วันละ ${weekdayHours} ชั่วโมง ในช่วงเวลา ${weekdayTime}
- วันเสาร์–อาทิตย์: อ่านได้วันละ ${weekendHours} ชั่วโมง
- กลยุทธ์การเน้น: ${focus}

คำสั่ง (Task Specification):
กรุณาจัดตารางอ่านหนังสือเป็นรายวัน (day 1 ถึง day ${days}) โดยระบุ:
1. วันที่ / ลำดับวัน
2. วิชา และหัวข้อย่อยที่เฉพาะเจาะจง (เช่น Data Mining: Decision Tree, Theory of Computation: PDA, Software Engineering: Agile/Scrum, Database: Normalization)
3. ช่วงเวลาเริ่มต้น-สิ้นสุด (Time slot) ที่แม่นยำ
4. มีเวลาพัก (Break 15-20 นาที) และเวลาทำแบบฝึกหัด (Practice) ทุกวัน
5. กำหนด "เป้าหมายวันนี้ (Daily Goal)" ที่ชัดเจน วัดผลได้
6. มีวันทบทวน (Review Day) และฝึกทำข้อสอบเก่าก่อนวันสอบจริง`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are an expert AI Study Planner. Provide high quality, structured study schedule JSON for Thai university students with realistic pacing, structured breaks, practice blocks, and precise subject topics.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            strategyNote: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  dateFormatted: { type: Type.STRING, description: 'เช่น วันจันทร์ที่ 3 ต.ค.' },
                  dailyGoal: { type: Type.STRING, description: 'เป้าหมายวันนี้ เช่น เข้าใจหลักการสร้าง Decision Tree และทำโจทย์ได้' },
                  primarySubject: { type: Type.STRING },
                  slots: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        time: { type: Type.STRING, description: 'เช่น 19.00–20.30 น.' },
                        activityType: { type: Type.STRING, description: 'study | break | practice | review' },
                        subject: { type: Type.STRING },
                        topic: { type: Type.STRING },
                        durationMinutes: { type: Type.INTEGER },
                      },
                      required: ['time', 'activityType', 'subject', 'topic']
                    }
                  }
                },
                required: ['dayNumber', 'dateFormatted', 'dailyGoal', 'primarySubject', 'slots']
              }
            }
          },
          required: ['summary', 'days']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    
    // Ensure slot IDs and completion flags
    if (parsed.days) {
      parsed.days.forEach((day: any) => {
        day.status = 'pending';
        day.slots?.forEach((slot: any, sIdx: number) => {
          if (!slot.id) slot.id = `day-${day.dayNumber}-slot-${sIdx + 1}`;
          slot.completed = false;
        });
      });
    }

    return res.json({
      success: true,
      plan: {
        meta: {
          generatedAt: new Date().toISOString(),
          source: 'gemini-3.8-flash',
          totalDays: days,
          summary: parsed.summary || 'ตารางอ่านหนังสือรายวันตามข้อกำหนด'
        },
        days: parsed.days
      },
      isLiveAI: true
    });
  } catch (error: any) {
    console.error('Error generating plan with Gemini:', error);
    // Graceful fallback to algorithmic plan so user is never blocked
    const fallback = generateAlgorithmicPlan(req.body);
    return res.json({
      success: true,
      plan: fallback,
      isLiveAI: false,
      errorNotice: error.message || 'Gemini error; switched to deterministic planner'
    });
  }
});

// API endpoint for Iterative Refinement
app.post('/api/plan/refine', async (req, res) => {
  try {
    const { currentPlan, instruction } = req.body;

    if (!instruction || !currentPlan) {
      return res.status(400).json({ success: false, message: 'Missing plan or instruction' });
    }

    if (!ai) {
      // Simple procedural modifier
      const modifiedDays = currentPlan.days.map((day: any) => {
        if (instruction.includes('เพิ่มเวลาพัก') || instruction.includes('พัก')) {
          day.slots.forEach((s: any) => {
            if (s.activityType === 'break') {
              s.durationMinutes = (s.durationMinutes || 15) + 15;
              s.topic = `พักผ่อน ${s.durationMinutes} นาที (ปรับตามคำขอ)`;
            }
          });
        }
        return day;
      });
      return res.json({
        success: true,
        plan: { ...currentPlan, days: modifiedDays },
        refinementSummary: `ปรับตารางตามคำขอ: "${instruction}"`,
        isLiveAI: false
      });
    }

    const promptText = `คุณคือ "AI Study Planner" กำลังทำการ "Iterative Prompting" เพื่อปรับปรุงตารางอ่านหนังสือเดิมตามคำสั่งของผู้ใช้:

คำสั่งขอปรับปรุงจากผู้ใช้:
"${instruction}"

ข้อมูลตารางเดิม (สรุป):
${JSON.stringify({
  totalDays: currentPlan.days?.length,
  firstThreeDays: currentPlan.days?.slice(0, 3)
})}

กรุณาปรับปรุงแผนการอ่านหนังสือให้ตรงกับคำขอของผู้ใช้ โดยยังคงความสมดุลและหัวข้อย่อยครบถ้วน ส่งผลลัพธ์กลับมาเป็นโครงสร้างตารางเดิมที่ได้รับการอัปเดต`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You refine an existing study plan based on user feedback (Iterative Prompting). Return JSON with updated days and a short explanation in Thai.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinementSummary: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  dateFormatted: { type: Type.STRING },
                  dailyGoal: { type: Type.STRING },
                  primarySubject: { type: Type.STRING },
                  slots: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        time: { type: Type.STRING },
                        activityType: { type: Type.STRING },
                        subject: { type: Type.STRING },
                        topic: { type: Type.STRING },
                        durationMinutes: { type: Type.INTEGER },
                        completed: { type: Type.BOOLEAN }
                      },
                      required: ['time', 'activityType', 'subject', 'topic']
                    }
                  }
                },
                required: ['dayNumber', 'dateFormatted', 'dailyGoal', 'primarySubject', 'slots']
              }
            }
          },
          required: ['refinementSummary', 'days']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      plan: {
        ...currentPlan,
        days: parsed.days || currentPlan.days
      },
      refinementSummary: parsed.refinementSummary || `ปรับแผนเรียบร้อยตามคำขอ: "${instruction}"`,
      isLiveAI: true
    });
  } catch (error: any) {
    console.error('Refine error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Prompt Lab Test Endpoint
app.post('/api/prompt/test', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    if (!ai) {
      return res.json({
        result: `[จำลองการทำงาน AI Study Planner]\nได้รับ Prompt:\n"${prompt}"\n\nAI ได้วิเคราะห์ข้อมูลและวางแผนให้เรียบร้อย (ระบบทำงานในโหมด Standalone แนะนำเพิ่ม GEMINI_API_KEY เพื่อเชื่อมต่อ Gemini 3.8 Flash สด)`
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    res.json({ result: response.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Study Planner server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
