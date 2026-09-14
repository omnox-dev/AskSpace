import React, { useState, useMemo } from 'react';
import { ThumbsUp, MessageSquare, Plus, Search, Tag, CheckCircle2, Clock, Shield, Sparkles, Download, Trash2 } from 'lucide-react';
import { Question, Classroom } from '@/types';
import { getSessionId } from '@/lib/store';

interface QuestionFeedProps {
  currentRoom: Classroom;
  questions: Question[];
  onAddQuestion: (content: string, topicTag: string, authorName: string) => void;
  onUpvoteQuestion: (questionId: string) => void;
  onAnswerQuestion: (questionId: string, answerText: string) => void;
  onClearRoomQuestions?: (classroomId: string) => void;
  isHostLoggedIn: boolean;
  onRunAiSynthesize: () => void;
}

export const QuestionFeed: React.FC<QuestionFeedProps> = ({
  currentRoom,
  questions,
  onAddQuestion,
  onUpvoteQuestion,
  onAnswerQuestion,
  onClearRoomQuestions,
  isHostLoggedIn,
  onRunAiSynthesize,
}) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newTopic, setNewTopic] = useState('Data Structures');
  const [authorName, setAuthorName] = useState('');
  const [isAnon, setIsAnon] = useState(true);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'upvotes' | 'newest'>('upvotes');

  // Answer modal state for Host
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [hostAnswerText, setHostAnswerText] = useState('');
  const [exportedMsg, setExportedMsg] = useState(false);

  const sessionId = getSessionId();

  // Unique topic tags for filtering
  const allTopicTags = useMemo(() => {
    const set = new Set<string>();
    questions.forEach(q => {
      if (q.topicTag) set.add(q.topicTag);
    });
    return Array.from(set);
  }, [questions]);

  // Filtered and sorted questions
  const filteredQuestions = useMemo(() => {
    return questions
      .filter(q => {
        const matchesSearch = q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.topicTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.authorName.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTag = selectedTag === 'ALL' || q.topicTag === selectedTag;
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === 'upvotes') {
          return b.upvotes - a.upvotes;
        }
        return b.createdAt - a.createdAt;
      });
  }, [questions, searchQuery, selectedTag, sortBy]);

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const displayAuthor = isAnon ? 'Anonymous Student' : (authorName.trim() || 'Student');
    onAddQuestion(newContent.trim(), newTopic.trim() || 'General', displayAuthor);
    
    setNewContent('');
    setShowPostModal(false);
  };

  const handleHostAnswerSubmit = (qId: string) => {
    if (!hostAnswerText.trim()) return;
    onAnswerQuestion(qId, hostAnswerText.trim());
    setAnsweringQuestionId(null);
    setHostAnswerText('');
  };

  // 1-Click CSV Exporter
  const handleExportCSV = () => {
    if (questions.length === 0) return;
    const headers = ['Question ID', 'Topic Tag', 'Question Content', 'Author', 'Upvotes', 'Status', 'Official Host Answer', 'Created At'];
    const rows = questions.map(q => [
      `"${q.id}"`,
      `"${q.topicTag.replace(/"/g, '""')}"`,
      `"${q.content.replace(/"/g, '""')}"`,
      `"${q.authorName.replace(/"/g, '""')}"`,
      q.upvotes,
      `"${q.status}"`,
      `"${(q.answer || '').replace(/"/g, '""')}"`,
      `"${new Date(q.createdAt).toISOString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentRoom.code}_questions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportedMsg(true);
    setTimeout(() => setExportedMsg(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 mb-6 shadow-sharp dark:shadow-sharp-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs uppercase">
              ROOM CODE: {currentRoom.code}
            </span>
            <span className="font-mono text-xs text-neutral-500 font-semibold">
              Host: {currentRoom.hostName}
            </span>
            {currentRoom.isLocked && (
              <span className="px-2 py-0.5 bg-red-600 text-white font-mono font-bold text-xs uppercase">
                🔒 LOCKED
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono text-black dark:text-white uppercase tracking-tight">
            {currentRoom.name}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              if (currentRoom.isLocked) return;
              setShowPostModal(true);
            }}
            disabled={currentRoom.isLocked}
            title={currentRoom.isLocked ? "Classroom is locked by instructor. New questions are disabled." : "Post a question"}
            className={`px-5 py-2.5 font-mono font-bold text-sm border-2 transition-all flex items-center space-x-2 shadow-sharp-sm dark:shadow-sharp-sm-white ${
              currentRoom.isLocked
                ? 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500 border-neutral-400 cursor-not-allowed'
                : 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white hover:bg-neutral-800 dark:hover:bg-neutral-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{currentRoom.isLocked ? 'ROOM LOCKED' : 'POST A QUESTION'}</span>
          </button>

          {/* INSTRUCTOR HOST ACTION BUTTONS */}
          {isHostLoggedIn && (
            <>
              <button
                onClick={onRunAiSynthesize}
                className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white font-mono font-bold text-sm border-2 border-black dark:border-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-black dark:text-white" />
                <span>AI SYNTHESIZE</span>
              </button>


              <button
                onClick={handleExportCSV}
                title="Export all classroom questions to CSV / Excel file"
                className="px-4 py-2.5 bg-white text-black dark:bg-black dark:text-white font-mono font-bold text-sm border-2 border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors flex items-center space-x-2 shadow-sharp-sm dark:shadow-sharp-sm-white"
              >
                <Download className="w-4 h-4" />
                <span>EXPORT CSV</span>
              </button>

              {onClearRoomQuestions && (
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to clear all ${questions.length} questions in ${currentRoom.code}? Make sure you exported CSV first!`)) {
                      onClearRoomQuestions(currentRoom.id);
                    }
                  }}
                  title="Clear all questions for next session"
                  className="px-3 py-2.5 bg-red-600 text-white font-mono font-bold text-sm border-2 border-black dark:border-white hover:bg-red-700 transition-colors flex items-center space-x-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>RESET ROOM</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {exportedMsg && (
        <div className="mb-4 p-3 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs text-center border-2 border-black dark:border-white">
          ✓ CLASSROOM DATA EXPORTED TO CSV DOWNLOADS!
        </div>
      )}

      {/* Control Bar: Search & Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-black dark:border-white">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
          <input
            type="text"
            placeholder="Search questions or topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-black border border-black dark:border-white font-mono text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          />
        </div>

        {/* Sort & Tag Filters */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          
          {/* Sort Switcher */}
          <div className="flex border border-black dark:border-white bg-white dark:bg-black">
            <button
              onClick={() => setSortBy('upvotes')}
              className={`px-3 py-1.5 font-bold ${sortBy === 'upvotes' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
            >
              🔥 Top Upvoted
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-3 py-1.5 font-bold ${sortBy === 'newest' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
            >
              ⚡ Newest
            </button>
          </div>

          {/* Topic Selector */}
          <select
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-black border border-black dark:border-white font-mono text-xs font-bold text-black dark:text-white focus:outline-none"
          >
            <option value="ALL">All Topics ({questions.length})</option>
            {allTopicTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions Feed Grid */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-black dark:border-white p-8">
            <MessageSquare className="w-12 h-12 mx-auto text-neutral-400 mb-3" />
            <h3 className="font-mono font-bold text-lg uppercase text-black dark:text-white">No Questions Found</h3>
            <p className="text-sm font-sans text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
              Be the first student to post a question in this room!
            </p>
            <button
              onClick={() => setShowPostModal(true)}
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs uppercase border border-black dark:border-white"
            >
              + Ask Question Now
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const hasUpvoted = q.upvotedBy.includes(sessionId);

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-black border-2 border-black dark:border-white p-5 hover:border-black dark:hover:border-white transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Topic Badge */}
                    <span className="px-2.5 py-0.5 bg-neutral-100 dark:bg-neutral-900 border border-black dark:border-white font-mono font-bold text-xs uppercase">
                      <Tag className="w-3 h-3 inline mr-1" />
                      {q.topicTag}
                    </span>

                    {/* Status Badge */}
                    {q.status === 'answered' ? (
                      <span className="px-2.5 py-0.5 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs uppercase flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Answered</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 border border-neutral-300 dark:border-neutral-700 font-mono text-xs text-neutral-500">
                        Pending Answer
                      </span>
                    )}
                  </div>

                  {/* Upvote Action Button */}
                  <button
                    onClick={() => onUpvoteQuestion(q.id)}
                    className={`flex items-center space-x-2 px-3 py-1.5 border-2 font-mono font-bold text-xs transition-all ${
                      hasUpvoted
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                        : 'bg-white text-black dark:bg-black dark:text-white border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-current' : ''}`} />
                    <span>{q.upvotes} UPVOTES</span>
                  </button>
                </div>

                {/* Question Body */}
                <p className="text-base sm:text-lg font-sans font-semibold text-black dark:text-white mb-3 leading-snug">
                  {q.content}
                </p>

                {/* Question Metadata */}
                <div className="flex items-center justify-between font-mono text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-800 pt-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-black dark:text-white">{q.authorName}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>

                  {/* Host Answer Toggle */}
                  {isHostLoggedIn && (
                    <button
                      onClick={() => setAnsweringQuestionId(answeringQuestionId === q.id ? null : q.id)}
                      className="font-bold underline hover:opacity-75 text-black dark:text-white"
                    >
                      {q.answer ? 'Edit Answer' : '+ Add Host Answer'}
                    </button>
                  )}
                </div>

                {/* Display Official Answer */}
                {q.answer && (
                  <div className="mt-3 p-4 bg-neutral-50 dark:bg-neutral-950 border-l-4 border-black dark:border-white font-sans text-sm">
                    <div className="font-mono font-bold text-xs uppercase mb-1 flex items-center space-x-1.5 text-black dark:text-white">
                      <Shield className="w-3.5 h-3.5 inline" />
                      <span>Official Host Answer</span>
                    </div>
                    <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                      {q.answer}
                    </p>
                  </div>
                )}

                {/* Host Answer Input Form */}
                {answeringQuestionId === q.id && (
                  <div className="mt-3 p-4 border border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 space-y-2">
                    <label className="block font-mono text-xs font-bold uppercase">Provide Host Explanation</label>
                    <textarea
                      rows={3}
                      value={hostAnswerText}
                      onChange={e => setHostAnswerText(e.target.value)}
                      placeholder="Type official classroom answer here..."
                      className="w-full p-2 bg-white dark:bg-black border border-black dark:border-white font-sans text-sm"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setAnsweringQuestionId(null)}
                        className="px-3 py-1 font-mono text-xs border border-neutral-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleHostAnswerSubmit(q.id)}
                        className="px-4 py-1 font-mono text-xs font-bold bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white"
                      >
                        Submit Answer
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Post Question Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 max-w-xl w-full shadow-sharp dark:shadow-sharp-white space-y-4">
            <div className="flex justify-between items-center border-b-2 border-black dark:border-white pb-3">
              <h3 className="font-mono font-black text-xl uppercase">Post Your Question</h3>
              <button 
                onClick={() => setShowPostModal(false)}
                className="font-mono font-bold text-lg hover:opacity-75"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  Topic / Sub-field
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures, Graph Theory, Midterm Q3..."
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-black border-2 border-black dark:border-white font-mono text-sm text-black dark:text-white"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  Question Detail
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="What concept or problem are you struggling with? Be specific..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-black border-2 border-black dark:border-white font-sans text-sm text-black dark:text-white"
                />
              </div>

              {/* Author mode */}
              <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-3">
                <label className="flex items-center space-x-2 font-mono text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnon}
                    onChange={e => setIsAnon(e.target.checked)}
                    className="accent-black dark:accent-white w-4 h-4"
                  />
                  <span className="font-bold">Post Anonymously</span>
                </label>

                {!isAnon && (
                  <input
                    type="text"
                    placeholder="Your Name (optional)"
                    value={authorName}
                    onChange={e => setAuthorName(e.target.value)}
                    className="px-3 py-1 bg-white dark:bg-black border border-black dark:border-white font-mono text-xs"
                  />
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 font-mono font-bold text-xs border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs uppercase border-2 border-black dark:border-white hover:opacity-90"
                >
                  POST QUESTION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
