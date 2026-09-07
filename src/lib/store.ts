import { Classroom, Question, AiQuestionSet, AiProviderConfig } from '@/types';

const DEFAULT_HOST_PIN = import.meta.env.VITE_HOST_ADMIN_PASSWORD || import.meta.env.VITE_HOST_ADMIN_PIN || 'admin';

const INITIAL_CLASSROOMS: Classroom[] = [
  {
    id: 'room-cs101',
    code: 'CS101',
    name: 'CS101: Data Structures & Algorithms',
    subject: 'Computer Science',
    hostName: 'Prof. Vance',
    hostPin: DEFAULT_HOST_PIN,
    createdAt: Date.now() - 86400000 * 2,
    activeStudents: 142,
    isLocked: false,
  },
  {
    id: 'room-math202',
    code: 'MATH20',
    name: 'Linear Algebra & Matrices',
    subject: 'Mathematics',
    hostName: 'Dr. Evelyn Reed',
    hostPin: DEFAULT_HOST_PIN,
    createdAt: Date.now() - 86400000,
    activeStudents: 89,
    isLocked: false,
  }
];

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    classroomId: 'room-cs101',
    authorName: 'Alex R.',
    authorIsGuest: true,
    content: 'What is the exact worst-case time complexity of QuickSort and why does picking a bad pivot cause O(n^2)?',
    topicTag: 'Sorting Algorithms',
    upvotes: 28,
    upvotedBy: ['user-1', 'user-2', 'user-3'],
    status: 'answered',
    answer: 'QuickSort is O(n^2) worst case when the pivot chosen consistently results in unbalanced partitions (e.g. smallest or largest element on sorted inputs). Balanced pivots yield O(n log n).',
    createdAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'q-2',
    classroomId: 'room-cs101',
    authorName: 'Anonymous Student',
    authorIsGuest: true,
    content: 'Can someone explain how hash collisions are handled using open addressing vs chaining?',
    topicTag: 'Data Structures',
    upvotes: 21,
    upvotedBy: ['user-4', 'user-5'],
    status: 'pending',
    createdAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'q-3',
    classroomId: 'room-cs101',
    authorName: 'Sarah M.',
    authorIsGuest: true,
    content: 'When should we prefer BFS over DFS for graph traversal? Is BFS always better for shortest path in unweighted graphs?',
    topicTag: 'Graph Theory',
    upvotes: 19,
    upvotedBy: ['user-6'],
    status: 'answered',
    answer: 'Yes! BFS guarantees finding the shortest path in terms of edge count for unweighted graphs because it explores level by level. DFS does not guarantee shortest path.',
    createdAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'q-4',
    classroomId: 'room-cs101',
    authorName: 'David K.',
    authorIsGuest: true,
    content: 'How does dynamic array resizing (like vector or ArrayList) achieve O(1) amortized insertion time?',
    topicTag: 'Memory Management',
    upvotes: 15,
    upvotedBy: [],
    status: 'pending',
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'q-5',
    classroomId: 'room-cs101',
    authorName: 'Anonymous Student',
    authorIsGuest: true,
    content: 'What is the difference between a Binary Search Tree (BST) and an AVL Tree balancing mechanism?',
    topicTag: 'Tree Structures',
    upvotes: 12,
    upvotedBy: [],
    status: 'pending',
    createdAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'q-6',
    classroomId: 'room-cs101',
    authorName: 'Rohan P.',
    authorIsGuest: true,
    content: 'Why is QuickSort preferred over MergeSort for arrays in-place, but MergeSort is preferred for Linked Lists?',
    topicTag: 'Sorting Algorithms',
    upvotes: 34,
    upvotedBy: ['user-7', 'user-8'],
    status: 'answered',
    answer: 'QuickSort has better cache locality and requires O(1) auxiliary space for arrays. MergeSort on linked lists does not require extra space since pointers can be mutated directly without array shifting.',
    createdAt: Date.now() - 1800000,
  },
  {
    id: 'q-7',
    classroomId: 'room-cs101',
    authorName: 'Priya S.',
    authorIsGuest: true,
    content: 'How do Dijkstra and A* search algorithms compare for shortest path search with heuristics?',
    topicTag: 'Graph Theory',
    upvotes: 16,
    upvotedBy: [],
    status: 'pending',
    createdAt: Date.now() - 900000,
  }
];

const INITIAL_AI_SETS: AiQuestionSet[] = [
  {
    id: 'set-cs101-1',
    classroomId: 'room-cs101',
    title: 'Midterm Review Question Set (AI Synthesized)',
    summary: 'Synthesized from 7 student questions focused on Algorithmic Complexity, Graph Algorithms, and Dynamic Memory.',
    createdAt: Date.now() - 3600000,
    totalInputQuestions: 7,
    topConfusions: [
      'QuickSort vs MergeSort memory & cache tradeoffs',
      'BFS shortest path vs DFS backtracking logic',
      'Hash table collision strategies (Chaining vs Open Addressing)'
    ],
    items: [
      {
        id: 'item-1',
        originalQuestionIds: ['q-1', 'q-6'],
        topic: 'Sorting & Complexity',
        synthesizedQuestion: 'Analyze the space and time trade-offs between QuickSort and MergeSort on arrays vs linked lists. Why does array cache locality favor QuickSort?',
        difficulty: 'Intermediate',
        explanation: 'Tests understanding of worst-case O(n^2) vs average O(n log n), cache locality, and auxiliary space efficiency.',
        sampleAnswer: 'QuickSort accesses contiguous array memory sequentially, maximizing CPU cache hits. MergeSort requires O(n) extra space for array merging, but for linked lists, pointer reassignments happen in O(1) extra space.',
        frequencyScore: 95,
      },
      {
        id: 'item-2',
        originalQuestionIds: ['q-3', 'q-7'],
        topic: 'Graph Algorithms',
        synthesizedQuestion: 'Compare BFS, Dijkstra, and A* for finding shortest paths. Under what condition does BFS fail for weighted graphs?',
        difficulty: 'Advanced',
        explanation: 'Synthesizes student inquiries regarding graph search choices.',
        sampleAnswer: 'BFS fails on weighted graphs because it counts edge steps, not total edge weights. Dijkstra uses a priority queue for edge weights, while A* adds an admissible heuristic.',
        frequencyScore: 88,
      },
      {
        id: 'item-3',
        originalQuestionIds: ['q-2'],
        topic: 'Data Structures',
        synthesizedQuestion: 'Explain the mechanism of Hash Collisions and compare Separate Chaining with Linear/Quadratic Probing.',
        difficulty: 'Basic',
        explanation: 'Addresses key data structure confusion regarding lookup degradation.',
        sampleAnswer: 'Separate chaining stores colliding keys in a linked list or tree at the bucket index. Open addressing searches subsequent slots in array order, suffering from primary/secondary clustering under high load factors.',
        frequencyScore: 75,
      }
    ]
  }
];

export const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server-session';
  let sid = localStorage.getItem('askspace_session_id');
  if (!sid) {
    sid = 'usr_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('askspace_session_id', sid);
  }
  return sid;
};

export const getStoredClassrooms = (): Classroom[] => {
  if (typeof window === 'undefined') return INITIAL_CLASSROOMS;
  const stored = localStorage.getItem('askspace_classrooms');
  if (!stored) {
    localStorage.setItem('askspace_classrooms', JSON.stringify(INITIAL_CLASSROOMS));
    return INITIAL_CLASSROOMS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_CLASSROOMS;
  }
};

export const saveClassrooms = (rooms: Classroom[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('askspace_classrooms', JSON.stringify(rooms));
  }
};

export const getStoredQuestions = (): Question[] => {
  if (typeof window === 'undefined') return INITIAL_QUESTIONS;
  const stored = localStorage.getItem('askspace_questions');
  if (!stored) {
    localStorage.setItem('askspace_questions', JSON.stringify(INITIAL_QUESTIONS));
    return INITIAL_QUESTIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_QUESTIONS;
  }
};

export const saveQuestions = (qs: Question[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('askspace_questions', JSON.stringify(qs));
  }
};

export const getStoredAiSets = (): AiQuestionSet[] => {
  if (typeof window === 'undefined') return INITIAL_AI_SETS;
  const stored = localStorage.getItem('askspace_ai_sets');
  if (!stored) {
    localStorage.setItem('askspace_ai_sets', JSON.stringify(INITIAL_AI_SETS));
    return INITIAL_AI_SETS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_AI_SETS;
  }
};

export const saveAiSets = (sets: AiQuestionSet[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('askspace_ai_sets', JSON.stringify(sets));
  }
};

export const getStoredAiConfig = (): AiProviderConfig => {
  if (typeof window === 'undefined') return { provider: 'groq' };
  const stored = localStorage.getItem('askspace_ai_config');
  if (!stored) {
    const envProvider = (import.meta.env.VITE_DEFAULT_AI_PROVIDER as any) || 'groq';
    return { provider: envProvider };
  }
  try {
    return JSON.parse(stored);
  } catch {
    return { provider: 'groq' };
  }
};

export const saveAiConfig = (config: AiProviderConfig) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('askspace_ai_config', JSON.stringify(config));
  }
};
