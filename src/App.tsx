import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ClassroomJoin } from '@/components/ClassroomJoin';
import { QuestionFeed } from '@/components/QuestionFeed';
import { AiSynthesizerModal } from '@/components/AiSynthesizerModal';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { HostAuthModal } from '@/components/HostAuthModal';
import { AiSettingsModal } from '@/components/AiSettingsModal';
import { HostClassroomList } from '@/components/HostClassroomList';
import { ParticleDotGrid } from '@/components/ParticleDotGrid';
import {
  Classroom,
  Question,
  AiQuestionSet,
  AiProviderConfig,
} from '@/types';
import {
  getStoredClassrooms,
  saveClassrooms,
  getStoredQuestions,
  saveQuestions,
  getStoredAiSets,
  saveAiSets,
  getStoredAiConfig,
  saveAiConfig,
  getSessionId,
} from '@/lib/store';

export default function App() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [aiSets, setAiSets] = useState<AiQuestionSet[]>([]);
  const [aiConfig, setAiConfig] = useState<AiProviderConfig>({ provider: 'groq' });

  // Theme state: DEFAULT LIGHT MODE
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Navigation & Active state
  const [currentRoom, setCurrentRoom] = useState<Classroom | null>(null);
  const [activeTab, setActiveTab] = useState<'questions' | 'analytics' | 'ai-sets' | 'host-classrooms'>('questions');
  const [isHostLoggedIn, setIsHostLoggedIn] = useState(false);

  // Modals state
  const [showHostModal, setShowHostModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);

  // Load initial state and theme on client
  useEffect(() => {
    const savedTheme = (localStorage.getItem('askspace_theme') as 'light' | 'dark') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const rooms = getStoredClassrooms();
    const qs = getStoredQuestions();
    const sets = getStoredAiSets();
    const cfg = getStoredAiConfig();

    setClassrooms(rooms);
    setQuestions(qs);
    setAiSets(sets);
    setAiConfig(cfg);
  }, []);

  // Theme Toggle Handler
  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('askspace_theme', nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Upvote Question handler
  const handleUpvote = (qId: string) => {
    const sessionId = getSessionId();

    setQuestions(prevQs => {
      const updated = prevQs.map(q => {
        if (q.id === qId) {
          const hasUpvoted = q.upvotedBy.includes(sessionId);
          let newUpvotedBy = [...q.upvotedBy];
          let newUpvotes = q.upvotes;

          if (hasUpvoted) {
            newUpvotedBy = newUpvotedBy.filter(id => id !== sessionId);
            newUpvotes = Math.max(0, newUpvotes - 1);
          } else {
            newUpvotedBy.push(sessionId);
            newUpvotes += 1;
          }

          return { ...q, upvotes: newUpvotes, upvotedBy: newUpvotedBy };
        }
        return q;
      });

      saveQuestions(updated);
      return updated;
    });
  };

  // Add Question handler
  const handleAddQuestion = (content: string, topicTag: string, authorName: string) => {
    if (!currentRoom) return;

    const newQ: Question = {
      id: `q-${Date.now()}`,
      classroomId: currentRoom.id,
      authorName,
      authorIsGuest: true,
      content,
      topicTag,
      upvotes: 1,
      upvotedBy: [getSessionId()],
      status: 'pending',
      createdAt: Date.now(),
    };

    setQuestions(prevQs => {
      const updated = [newQ, ...prevQs];
      saveQuestions(updated);
      return updated;
    });
  };

  // Clear Room handler (Host feature after CSV export)
  const handleClearRoomQuestions = (classroomId: string) => {
    setQuestions(prevQs => {
      const updated = prevQs.filter(q => q.classroomId !== classroomId);
      saveQuestions(updated);
      return updated;
    });
  };

  // Answer Question handler (Host feature)
  const handleAnswerQuestion = (qId: string, answerText: string) => {
    setQuestions(prevQs => {
      const updated = prevQs.map(q => {
        if (q.id === qId) {
          return {
            ...q,
            status: 'answered' as const,
            answer: answerText,
          };
        }
        return q;
      });
      saveQuestions(updated);
      return updated;
    });
  };

  // Create Room handler
  const handleCreateRoom = (name: string, subject: string, hostName: string, pin: string) => {
    const code = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase() || 'RM' + Math.floor(Math.random() * 100);

    const newRoom: Classroom = {
      id: `room-${Date.now()}`,
      code,
      name,
      subject,
      hostName,
      hostPin: pin,
      createdAt: Date.now(),
      activeStudents: 1,
      isLocked: false,
    };

    const updatedRooms = [newRoom, ...classrooms];
    setClassrooms(updatedRooms);
    saveClassrooms(updatedRooms);
    setCurrentRoom(newRoom);
    setIsHostLoggedIn(true); // Automatically log in creator as host
    setActiveTab('questions');
  };

  // Delete Room handler (Host feature)
  const handleDeleteClassroom = (classroomId: string) => {
    const updatedRooms = classrooms.filter(c => c.id !== classroomId);
    setClassrooms(updatedRooms);
    saveClassrooms(updatedRooms);

    const updatedQs = questions.filter(q => q.classroomId !== classroomId);
    setQuestions(updatedQs);
    saveQuestions(updatedQs);

    if (currentRoom?.id === classroomId) {
      setCurrentRoom(null);
      setActiveTab('host-classrooms');
    }
  };

  // Lock/Unlock Room handler (Host feature)
  const handleToggleLockClassroom = (classroomId: string) => {
    const updatedRooms = classrooms.map(c => {
      if (c.id === classroomId) {
        return { ...c, isLocked: !c.isLocked };
      }
      return c;
    });
    setClassrooms(updatedRooms);
    saveClassrooms(updatedRooms);

    if (currentRoom?.id === classroomId) {
      setCurrentRoom(prev => prev ? { ...prev, isLocked: !prev.isLocked } : null);
    }
  };

  // Enter Room as Host handler
  const handleSelectRoomAsHost = (room: Classroom) => {
    setCurrentRoom(room);
    setIsHostLoggedIn(true);
    setActiveTab('questions');
  };

  // AI Set Created Handler
  const handleSaveNewSet = (newSet: AiQuestionSet) => {
    const updatedSets = [newSet, ...aiSets];
    setAiSets(updatedSets);
    saveAiSets(updatedSets);
  };

  // AI Provider Config Save Handler
  const handleSaveAiConfig = (cfg: AiProviderConfig) => {
    setAiConfig(cfg);
    saveAiConfig(cfg);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors duration-200 relative overflow-hidden">
      
      {/* Antigravity Fluid Interactive Dotted Matrix Background */}
      <ParticleDotGrid />

      {/* Sleek Top Navbar */}
      <Navbar
        currentRoom={currentRoom}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isHostLoggedIn={isHostLoggedIn}
        onOpenHostAuth={() => setShowHostModal(true)}
        onHostLogout={() => {
          setIsHostLoggedIn(false);
          setActiveTab('questions');
        }}
        onOpenAiSettings={() => setShowAiModal(true)}

        onOpenNewRoomModal={() => setShowNewRoomModal(true)}
        aiConfig={aiConfig}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onGoToHostDashboard={() => setActiveTab('host-classrooms')}
      />

      {/* Main View Router */}
      <main className="flex-1 relative z-10">
        {activeTab === 'host-classrooms' ? (

          <HostClassroomList
            classrooms={classrooms}
            questions={questions}
            onSelectRoomAsHost={handleSelectRoomAsHost}
            onCreateRoom={handleCreateRoom}
            onToggleLockRoom={handleToggleLockClassroom}
            onDeleteRoom={handleDeleteClassroom}
          />
        ) : !currentRoom ? (
          <ClassroomJoin
            classrooms={classrooms}
            onSelectRoom={room => {
              setCurrentRoom(room);
              setActiveTab('questions');
            }}
            onCreateRoom={handleCreateRoom}
            onOpenHostDashboard={() => {
              if (isHostLoggedIn) {
                setActiveTab('host-classrooms');
              } else {
                setShowHostModal(true);
              }
            }}
          />
        ) : (
          <>
            {/* Quick Switch Room Bar */}
            <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-black dark:border-white px-4 py-2 text-xs font-mono">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold uppercase">Active Classroom:</span>
                  <span className="bg-black text-white dark:bg-white dark:text-black px-1.5 py-0.5 font-bold">
                    {currentRoom.code}
                  </span>
                  <span>- {currentRoom.name}</span>
                </div>

                <div className="flex items-center space-x-4">
                  {isHostLoggedIn && (
                    <button
                      onClick={() => setActiveTab('host-classrooms')}
                      className="font-bold underline hover:opacity-75 uppercase text-black dark:text-white"
                    >
                      ❖ Host Classrooms Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentRoom(null)}
                    className="font-bold underline hover:opacity-75 uppercase"
                  >
                    ← Exit Room
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Views */}
            {activeTab === 'questions' && (
              <QuestionFeed
                currentRoom={currentRoom}
                questions={questions.filter(q => q.classroomId === currentRoom.id)}
                onAddQuestion={handleAddQuestion}
                onUpvoteQuestion={handleUpvote}
                onAnswerQuestion={handleAnswerQuestion}
                onClearRoomQuestions={handleClearRoomQuestions}
                isHostLoggedIn={isHostLoggedIn}
                onRunAiSynthesize={() => setActiveTab('ai-sets')}
              />
            )}

            {activeTab === 'ai-sets' && (
              <AiSynthesizerModal
                currentRoomId={currentRoom.id}
                questions={questions.filter(q => q.classroomId === currentRoom.id)}
                aiSets={aiSets}
                onSaveNewSet={handleSaveNewSet}
                aiConfig={aiConfig}
                onOpenAiSettings={() => setShowAiModal(true)}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsDashboard
                currentRoom={currentRoom}
                questions={questions.filter(q => q.classroomId === currentRoom.id)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black dark:border-white py-6 bg-white dark:bg-black font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 text-center sm:flex justify-between items-center text-neutral-500">
          <div>
            <strong>ASKSPACE</strong> - High Capacity Black & White AI Q&A Platform
          </div>
          <div className="mt-2 sm:mt-0 space-x-4">
            <span>Groq & Gemini Ready</span>
            <span>•</span>
            <span>Vercel Optimized</span>
            <span>•</span>
            <span>1,000+ Concurrent Students</span>
          </div>
        </div>
      </footer>

      {/* Host Auth Modal */}
      {showHostModal && (
        <HostAuthModal
          currentRoom={currentRoom}
          onSuccessLogin={() => {
            setIsHostLoggedIn(true);
            if (!currentRoom) {
              setActiveTab('host-classrooms');
            }
          }}
          onClose={() => setShowHostModal(false)}
        />
      )}

      {/* AI Settings Modal */}
      {showAiModal && (
        <AiSettingsModal
          aiConfig={aiConfig}
          onSaveConfig={handleSaveAiConfig}
          onClose={() => setShowAiModal(false)}
        />
      )}

      {/* New Room Quick Modal */}
      {showNewRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono">
          <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 max-w-md w-full shadow-sharp dark:shadow-sharp-white space-y-4">
            <div className="flex justify-between items-center border-b-2 border-black dark:border-white pb-3">
              <h3 className="font-bold text-lg uppercase">Host a New Classroom</h3>
              <button onClick={() => setShowNewRoomModal(false)} className="font-bold text-lg hover:opacity-75">✕</button>
            </div>
            
            <ClassroomJoin
              classrooms={classrooms}
              onSelectRoom={room => {
                setCurrentRoom(room);
                setShowNewRoomModal(false);
              }}
              onCreateRoom={(name, subj, host, pin) => {
                handleCreateRoom(name, subj, host, pin);
                setShowNewRoomModal(false);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}

