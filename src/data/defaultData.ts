import { SubjectItem, StudyPlan } from '../types';

export const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: 'subj-1',
    name: 'Data Mining',
    difficulty: 'ยากมาก',
    examInDays: 7,
    topics: 'Decision Tree, K-Means Clustering, Association Rules, Evaluation Metrics',
    color: '#3B82F6' // Blue
  },
  {
    id: 'subj-2',
    name: 'Theory of Computation',
    difficulty: 'ยากมาก',
    examInDays: 9,
    topics: 'DFA/NFA, Pushdown Automata (PDA), Context-Free Grammar, Turing Machines',
    color: '#8B5CF6' // Purple
  },
  {
    id: 'subj-3',
    name: 'Software Engineering',
    difficulty: 'ปานกลาง',
    examInDays: 12,
    topics: 'Agile/Scrum, Design Patterns, Software Architecture, Testing & CI/CD',
    color: '#10B981' // Emerald
  },
  {
    id: 'subj-4',
    name: 'Database',
    difficulty: 'ปานกลาง',
    examInDays: 14,
    topics: 'ER Diagram, Normalization (1NF–BCNF), Complex SQL, Transaction & ACID',
    color: '#F59E0B' // Amber
  }
];

export const PROMPT_TECHNIQUES = [
  {
    id: 'role',
    name: 'Role Prompting',
    thaiName: 'กำหนดบทบาทผู้เชี่ยวชาญ',
    description: 'กำหนดให้ AI สวมบทบาทเป็น "AI Study Planner" เพื่อดึงชุดความรู้ด้านการวางแผนการเรียน การจัดสรรเวลาแบบมีประสิทธิภาพสูงสุด',
    example: '“คุณคือ AI Study Planner ช่วยวางแผนการอ่านหนังสือสำหรับนักศึกษามหาวิทยาลัย...”',
    impact: 'AI เข้าใจบริบทการศึกษาในระดับอุดมศึกษา ไม่ตอบแบบทั่วไป และใช้ภาษาเชิงวิชาการที่เหมาะสม'
  },
  {
    id: 'context',
    name: 'Context & Background',
    thaiName: 'ให้บริบทและข้อมูลแวดล้อม',
    description: 'ระบุชื่อวิชา วันสอบ และเวลาว่างที่มีอย่างชัดเจน เพื่อให้ AI คำนวณปริมาณเนื้อหาเทียบกับเวลา',
    example: '“วิชา: Data Mining, Software Engineering, Theory of Computation และ Database, สอบในอีก 14 วัน”',
    impact: 'AI จัดลำดับความสำคัญตามวันสอบจริง ไม่เกลี่ยเวลาเท่ากันแบบสุ่ม'
  },
  {
    id: 'constraint',
    name: 'Constraint & Boundaries',
    thaiName: 'กำหนดข้อจำกัดและเงื่อนไข',
    description: 'กำหนดเวลาอ่านจริง ช่วงเวลาเริ่มต้น-สิ้นสุด และความต่างระหว่างวันธรรมดากับเสาร์-อาทิตย์',
    example: '“วันจันทร์–ศุกร์ อ่านได้เวลา 19.00–22.00 น. (3 ชม.), วันเสาร์–อาทิตย์ อ่านได้วันละ 5 ชั่วโมง”',
    impact: 'แผนตารางสามารถนำไปใช้ในชีวิตจริงได้ ไม่เกิดตารางโอเวอร์โหลดจนทำไม่ได้'
  },
  {
    id: 'task',
    name: 'Task Specification',
    thaiName: 'ระบุขอบเขตงานชัดเจน',
    description: 'บอกอย่างชัดเจนว่าต้องการให้ทำอะไรบ้าง เช่น กำหนดวิชา หัวข้อย่อย ระยะเวลา เวลาพัก และวันทบทวน',
    example: '“พร้อมระบุวิชา หัวข้อที่ต้องอ่าน ระยะเวลา และเวลาพัก โดยให้มีวันทบทวนและทำแบบฝึกหัดก่อนสอบด้วย”',
    impact: 'AI ไม่เพียงแต่บอกว่าอ่านวิชาอะไร แต่ระบุบทเรียน และแบ่งช่วงฝึกทำโจทย์อย่างเป็นระบบ'
  },
  {
    id: 'output',
    name: 'Output Format',
    thaiName: 'กำหนดรูปแบบผลลัพธ์',
    description: 'บังคับรูปแบบผลลัพธ์ เช่น ให้แจกแจงเป็นตารางรายวัน มีช่วงเวลา มีเป้าหมาย และมีช่องเช็คสถานะ',
    example: '“กรุณาจัดตารางอ่านหนังสือเป็นรายวัน พร้อมระบุเวลาเริ่ม-จบ และเป้าหมายประจำวัน”',
    impact: 'ผลลัพธ์อ่านง่าย เป็นสัดส่วน ติดตามผลและนำเข้าปฏิทินได้ทันที'
  },
  {
    id: 'iterative',
    name: 'Iterative Prompting',
    thaiName: 'ปรับปรุงแบบต่อเนื่อง',
    description: 'ส่ง Prompt เพิ่มเติมเพื่อปรับแผนตามฟีดแบ็กจริง เช่น ขอเพิ่มเวลาพัก สลับวิชา หรือเน้นบทที่ยังไม่แม่น',
    example: '“ขอเพิ่มเวลาพักเป็น 30 นาที และเน้นทำโจทย์ Decision Tree เพิ่มอีก 1 วัน”',
    impact: 'ได้ตารางที่ยืดหยุ่นและตรงกับพฤติกรรมจริงของผู้เรียนในแต่ละวัน'
  }
];

export const BEFORE_PROMPT = `“ช่วยจัดตารางอ่านหนังสือให้ฉันหน่อย”`;

export const AFTER_PROMPT = `“คุณคือ AI Study Planner ช่วยวางแผนการอ่านหนังสือสำหรับนักศึกษามหาวิทยาลัย โดยมีข้อมูลดังนี้

วิชา: Data Mining, Software Engineering, Theory of Computation และ Database
สอบในอีก 14 วัน
มีเวลาอ่านวันละ 3 ชั่วโมง
วันจันทร์–ศุกร์ อ่านได้เวลา 19.00–22.00 น.
วันเสาร์–อาทิตย์ อ่านได้วันละ 5 ชั่วโมง
ต้องการเน้นวิชาที่สอบก่อนและวิชาที่เข้าใจยาก

กรุณาจัดตารางอ่านหนังสือเป็นรายวัน พร้อมระบุวิชา หัวข้อที่ต้องอ่าน ระยะเวลา และเวลาพัก โดยให้มีวันทบทวนและทำแบบฝึกหัดก่อนสอบด้วย”`;

export const BEFORE_RESULT = `อ่าน Data Mining วันจันทร์
อ่าน Database วันอังคาร
อ่าน Software Engineering วันพุธ
อ่าน Theory of Computation วันพฤหัสบดี`;

export const AFTER_RESULT_HIGHLIGHTS = [
  {
    day: 'วันจันทร์',
    schedule: [
      { time: '19.00–20.30 น.', text: 'Data Mining: Decision Tree', type: 'study' },
      { time: '20.30–20.45 น.', text: 'พักผ่อน 15 นาที', type: 'break' },
      { time: '20.45–22.00 น.', text: 'ทำแบบฝึกหัด Decision Tree', type: 'practice' }
    ],
    goal: 'เข้าใจหลักการสร้าง Decision Tree และสามารถทำโจทย์พื้นฐานได้'
  },
  {
    day: 'วันอังคาร',
    schedule: [
      { time: '19.00–20.30 น.', text: 'Theory of Computation: Pushdown Automata (PDA)', type: 'study' },
      { time: '20.30–20.45 น.', text: 'พักผ่อน 15 นาที', type: 'break' },
      { time: '20.45–22.00 น.', text: 'ฝึกสร้าง PDA และทำโจทย์ข้อสอบ', type: 'practice' }
    ],
    goal: 'เข้าใจ Transition Function ของ PDA และฝึกแปลง Context-Free Grammar เป็น PDA'
  }
];

export const INITIAL_STUDY_PLAN: StudyPlan = {
  meta: {
    generatedAt: '2026-10-03T06:00:00Z',
    source: 'AI Study Planner (Optimized with Prompt Engineering)',
    totalDays: 14,
    summary: 'ตารางอ่านหนังสือ 14 วัน สำหรับ 4 วิชาหลัก (Data Mining, TOC, SE, Database) เน้นวิชาที่สอบก่อนและความยากสูง พร้อมช่วงพักและการฝึกทำโจทย์'
  },
  days: [
    {
      dayNumber: 1,
      dateFormatted: 'วันจันทร์ที่ 3 ตุลาคม',
      dailyGoal: 'เข้าใจหลักการสร้าง Decision Tree, Information Gain และสามารถทำโจทย์พื้นฐานได้',
      primarySubject: 'Data Mining',
      status: 'pending',
      slots: [
        {
          id: 'd1-s1',
          time: '19.00–20.30 น.',
          activityType: 'study',
          subject: 'Data Mining',
          topic: 'Decision Tree & Information Gain Concept',
          durationMinutes: 90,
          completed: true
        },
        {
          id: 'd1-s2',
          time: '20.30–20.45 น.',
          activityType: 'break',
          subject: 'พักผ่อน',
          topic: 'พักสายตา ผ่อนคลาย ดื่มน้ำ',
          durationMinutes: 15,
          completed: true
        },
        {
          id: 'd1-s3',
          time: '20.45–22.00 น.',
          activityType: 'practice',
          subject: 'Data Mining',
          topic: 'ทำแบบฝึกหัด Decision Tree และคำนวณ Entropy',
          durationMinutes: 75,
          completed: false
        }
      ]
    },
    {
      dayNumber: 2,
      dateFormatted: 'วันอังคารที่ 4 ตุลาคม',
      dailyGoal: 'เข้าใจโครงสร้าง PDA และสามารถเขียน Transition Function สำหรับโจทย์ตัวอย่างได้',
      primarySubject: 'Theory of Computation',
      status: 'pending',
      slots: [
        {
          id: 'd2-s1',
          time: '19.00–20.30 น.',
          activityType: 'study',
          subject: 'Theory of Computation',
          topic: 'Pushdown Automata (PDA) & Stack Transition',
          durationMinutes: 90,
          completed: false
        },
        {
          id: 'd2-s2',
          time: '20.30–20.45 น.',
          activityType: 'break',
          subject: 'พักผ่อน',
          topic: 'พักสมอง ยืดกล้ามเนื้อ',
          durationMinutes: 15,
          completed: false
        },
        {
          id: 'd2-s3',
          time: '20.45–22.00 น.',
          activityType: 'practice',
          subject: 'Theory of Computation',
          topic: 'ฝึกสร้าง PDA และทำโจทย์ข้อสอบเก่า Context-Free Language',
          durationMinutes: 75,
          completed: false
        }
      ]
    },
    {
      dayNumber: 3,
      dateFormatted: 'วันพุธที่ 5 ตุลาคม',
      dailyGoal: 'สรุปวงจร Agile / Scrum Framework และความต่างของ Design Patterns หลัก',
      primarySubject: 'Software Engineering',
      status: 'pending',
      slots: [
        {
          id: 'd3-s1',
          time: '19.00–20.30 น.',
          activityType: 'study',
          subject: 'Software Engineering',
          topic: 'Agile/Scrum Ceremonies, Sprint Planning & User Stories',
          durationMinutes: 90,
          completed: false
        },
        {
          id: 'd3-s2',
          time: '20.30–20.45 น.',
          activityType: 'break',
          subject: 'พักผ่อน',
          topic: 'พักสายตา 15 นาที',
          durationMinutes: 15,
          completed: false
        },
        {
          id: 'd3-s3',
          time: '20.45–22.00 น.',
          activityType: 'practice',
          subject: 'Software Engineering',
          topic: 'วิเคราะห์ Case Study สถาปัตยกรรมซอฟต์แวร์และการเขียน Sprint Backlog',
          durationMinutes: 75,
          completed: false
        }
      ]
    },
    {
      dayNumber: 4,
      dateFormatted: 'วันพฤหัสบดีที่ 6 ตุลาคม',
      dailyGoal: 'ชำนาญการทำ Normalization จาก 1NF ถึง BCNF และเข้าใจ Functional Dependency',
      primarySubject: 'Database',
      status: 'pending',
      slots: [
        {
          id: 'd4-s1',
          time: '19.00–20.30 น.',
          activityType: 'study',
          subject: 'Database',
          topic: 'Functional Dependency & Normalization (1NF, 2NF, 3NF, BCNF)',
          durationMinutes: 90,
          completed: false
        },
        {
          id: 'd4-s2',
          time: '20.30–20.45 น.',
          activityType: 'break',
          subject: 'พักผ่อน',
          topic: 'พักผ่อนและรับประทานของว่างเบาๆ',
          durationMinutes: 15,
          completed: false
        },
        {
          id: 'd4-s3',
          time: '20.45–22.00 น.',
          activityType: 'practice',
          subject: 'Database',
          topic: 'แก้โจทย์ตาราง Unnormalized ให้เป็น 3NF และเขียน SQL DDL',
          durationMinutes: 75,
          completed: false
        }
      ]
    },
    {
      dayNumber: 5,
      dateFormatted: 'วันศุกร์ที่ 7 ตุลาคม',
      dailyGoal: 'ทบทวนอัลกอริทึม Clustering (K-Means) และการประเมินผล Silhouette Score',
      primarySubject: 'Data Mining',
      status: 'pending',
      slots: [
        {
          id: 'd5-s1',
          time: '19.00–20.30 น.',
          activityType: 'study',
          subject: 'Data Mining',
          topic: 'K-Means, Hierarchical Clustering & Distance Metrics',
          durationMinutes: 90,
          completed: false
        },
        {
          id: 'd5-s2',
          time: '20.30–20.45 น.',
          activityType: 'break',
          subject: 'พักผ่อน',
          topic: 'พักเบรก 15 นาที',
          durationMinutes: 15,
          completed: false
        },
        {
          id: 'd5-s3',
          time: '20.45–22.00 น.',
          activityType: 'practice',
          subject: 'Data Mining',
          topic: 'คำนวณการจัดกลุ่ม K-Means ด้วยมือ และสรุปสูตร',
          durationMinutes: 75,
          completed: false
        }
      ]
    },
    {
      dayNumber: 6,
      dateFormatted: 'วันเสาร์ที่ 8 ตุลาคม (วันหยุด 5 ชม.)',
      dailyGoal: 'ลุยโจทย์ใหญ่ Theory of Computation + Data Mining และจำลองทำข้อสอบเก่า',
      primarySubject: 'Theory of Computation',
      status: 'pending',
      slots: [
        {
          id: 'd6-s1',
          time: '09.30–11.30 น.',
          activityType: 'study',
          subject: 'Theory of Computation',
          topic: 'Turing Machines: Formal Definition & State Transition Diagram',
          durationMinutes: 120,
          completed: false
        },
        {
          id: 'd6-s2',
          time: '11.30–13.00 น.',
          activityType: 'break',
          subject: 'พักกลางวัน',
          topic: 'รับประทานอาหารกลางวันและผ่อนคลาย (90 นาที)',
          durationMinutes: 90,
          completed: false
        },
        {
          id: 'd6-s3',
          time: '13.00–14.30 น.',
          activityType: 'practice',
          subject: 'Theory of Computation',
          topic: 'ตะลุยโจทย์ข้อสอบเก่า TOC: DFA, NFA, PDA, Turing Machine',
          durationMinutes: 90,
          completed: false
        },
        {
          id: 'd6-s4',
          time: '14.30–14.45 น.',
          activityType: 'break',
          subject: 'พักเบรก',
          topic: 'จิบกาแฟ พักสายตา',
          durationMinutes: 15,
          completed: false
        },
        {
          id: 'd6-s5',
          time: '14.45–16.15 น.',
          activityType: 'review',
          subject: 'Data Mining',
          topic: 'ทบทวนสูตร Association Rules (Support, Confidence, Lift) & Apriori',
          durationMinutes: 90,
          completed: false
        }
      ]
    },
    {
      dayNumber: 7,
      dateFormatted: 'วันอาทิตย์ที่ 9 ตุลาคม (วันหยุด 5 ชม.)',
      dailyGoal: 'ซ้อมทำ Mock Exam วิชา Data Mining (สอบพรุ่งนี้/อีก 1 วัน) และทบทวน Database SQL',
      primarySubject: 'Data Mining',
      status: 'pending',
      slots: [
        {
          id: 'd7-s1',
          time: '09.30–11.30 น.',
          activityType: 'review',
          subject: 'Data Mining',
          topic: 'จำลองทำ Mock Exam Data Mining จับเวลาเสมือนจริง 2 ชั่วโมง',
          durationMinutes: 120,
          completed: false
        },
        {
          id: 'd7-s2',
          time: '11.30–13.00 น.',
          activityType: 'break',
          subject: 'พักกลางวัน',
          topic: 'พักผ่อนกลางวัน รีชาร์จพลัง',
          durationMinutes: 90,
          completed: false
        },
        {
          id: 'd7-s3',
          time: '13.00–14.30 น.',
          activityType: 'study',
          subject: 'Database',
          topic: 'Indexing (B+ Tree, Hash), Query Optimization & Transactions (ACID)',
          durationMinutes: 90,
          completed: false
        },
        {
          id: 'd7-s4',
          time: '14.30–14.45 น.',
          activityType: 'break',
          subject: 'พักเบรก',
          topic: 'ยืดเหยียดร่างกาย 15 นาที',
          durationMinutes: 15,
          completed: false
        },
        {
          id: 'd7-s5',
          time: '14.45–16.15 น.',
          activityType: 'practice',
          subject: 'Database',
          topic: 'เขียน Complex SQL Query (Window Function, Correlated Subquery)',
          durationMinutes: 90,
          completed: false
        }
      ]
    }
  ]
};
