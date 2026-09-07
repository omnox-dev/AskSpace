export interface Question {
  id: string;
  classroomId: string;
  authorName: string;
  authorIsGuest: boolean;
  content: string;
  topicTag: string;
  upvotes: number;
  upvotedBy: string[]; // user session IDs
  status: 'pending' | 'answered' | 'flagged';
  answer?: string;
  createdAt: number;
}

export interface Classroom {
  id: string;
  code: string; // 6-digit pin, e.g. "CS-101"
  name: string;
  subject: string;
  hostName: string;
  hostPin: string;
  createdAt: number;
  activeStudents: number;
  isLocked: boolean;
}

export interface CuratedQuestionItem {
  id: string;
  originalQuestionIds: string[];
  topic: string;
  synthesizedQuestion: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  explanation: string;
  sampleAnswer: string;
  frequencyScore: number; // 1-100 score based on occurrence
}

export interface AiQuestionSet {
  id: string;
  classroomId: string;
  title: string;
  summary: string;
  createdAt: number;
  totalInputQuestions: number;
  items: CuratedQuestionItem[];
  topConfusions: string[];
}

export interface TopicStat {
  topic: string;
  count: number;
  upvotes: number;
}

export interface VelocityStat {
  timeLabel: string;
  questionsCount: number;
  upvotesCount: number;
}

export interface AiProviderConfig {
  provider: 'groq' | 'gemini' | 'builtin';
  groqApiKey?: string;
  geminiApiKey?: string;
  model?: string;
}
