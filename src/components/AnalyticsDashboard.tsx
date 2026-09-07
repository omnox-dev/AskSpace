import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { BarChart2, TrendingUp, HelpCircle, CheckCircle, Flame, Users } from 'lucide-react';
import { Question, Classroom } from '@/types';

interface AnalyticsDashboardProps {
  currentRoom: Classroom;
  questions: Question[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  currentRoom,
  questions,
}) => {
  // Topic frequency data
  const topicData = useMemo(() => {
    const counts: Record<string, { count: number; upvotes: number }> = {};
    questions.forEach(q => {
      const topic = q.topicTag || 'General';
      if (!counts[topic]) counts[topic] = { count: 0, upvotes: 0 };
      counts[topic].count += 1;
      counts[topic].upvotes += q.upvotes;
    });

    return Object.entries(counts)
      .map(([topic, val]) => ({
        topic,
        questionsCount: val.count,
        totalUpvotes: val.upvotes,
      }))
      .sort((a, b) => b.questionsCount - a.questionsCount);
  }, [questions]);

  // Velocity / Timeline data
  const velocityData = useMemo(() => {
    const buckets: Record<string, number> = {};
    questions.forEach(q => {
      const timeStr = new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      buckets[timeStr] = (buckets[timeStr] || 0) + 1;
    });

    const entries = Object.entries(buckets).map(([time, count]) => ({ time, count }));
    if (entries.length === 0) return [{ time: '12:00', count: 0 }];
    return entries;
  }, [questions]);

  // Stats calculation
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(q => q.status === 'answered').length;
  const totalUpvotes = questions.reduce((acc, q) => acc + q.upvotes, 0);
  const answerRate = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  // Top 5 most upvoted questions
  const topQuestions = useMemo(() => {
    return [...questions].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);
  }, [questions]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 mb-8 shadow-sharp dark:shadow-sharp-white">
        <div className="flex items-center space-x-2 mb-1">
          <span className="px-2.5 py-0.5 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs uppercase flex items-center space-x-1">
            <BarChart2 className="w-3.5 h-3.5 inline" />
            <span>CLASSROOM ANALYTICS</span>
          </span>
          <span className="font-mono text-xs text-neutral-500 font-semibold">
            {currentRoom.name}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-mono text-black dark:text-white uppercase tracking-tight">
          Monochrome Analytics & Graphs
        </h1>
        <p className="text-sm font-sans text-neutral-600 dark:text-neutral-400 mt-1">
          Real-time metrics tracking question volume, most-asked topics, and student engagement velocity.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-mono">
        <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-neutral-500 font-bold uppercase">Total Questions</span>
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black">{totalQuestions}</div>
          <div className="text-[10px] text-neutral-400 mt-1">Submitted in room</div>
        </div>

        <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-neutral-500 font-bold uppercase">Student Engagement</span>
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black">{totalUpvotes}</div>
          <div className="text-[10px] text-neutral-400 mt-1">Total upvotes cast</div>
        </div>

        <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-neutral-500 font-bold uppercase">Answer Resolution</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black">{answerRate}%</div>
          <div className="text-[10px] text-neutral-400 mt-1">{answeredQuestions} of {totalQuestions} answered</div>
        </div>

        <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-neutral-500 font-bold uppercase">Active Students</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black">{currentRoom.activeStudents}</div>
          <div className="text-[10px] text-neutral-400 mt-1">Concurrent in lecture</div>
        </div>
      </div>

      {/* Main Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Graph 1: Most Asked Topics Bar Chart */}
        <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 shadow-sharp dark:shadow-sharp-white">
          <h3 className="font-mono font-bold text-sm uppercase mb-4 tracking-wider flex items-center space-x-2">
            <span>MOST ASKED TOPICS</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.3} />
                <XAxis 
                  dataKey="topic" 
                  tick={{ fontSize: 10, fontFamily: 'monospace', fill: 'currentColor' }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fontFamily: 'monospace', fill: 'currentColor' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000000', 
                    color: '#ffffff', 
                    border: '1px solid #ffffff', 
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="questionsCount" fill="#000000" className="dark:fill-white" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Question Submission Velocity Line Chart */}
        <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 shadow-sharp dark:shadow-sharp-white">
          <h3 className="font-mono font-bold text-sm uppercase mb-4 tracking-wider flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 inline" />
            <span>QUESTION VELOCITY OVER TIME</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.3} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fontFamily: 'monospace', fill: 'currentColor' }} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'monospace', fill: 'currentColor' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000000', 
                    color: '#ffffff', 
                    border: '1px solid #ffffff', 
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#000000" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#000000' }} 
                  className="dark:stroke-white dark:dot-fill-white"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top 5 High-Impact Questions Table */}
      <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6">
        <h3 className="font-mono font-bold text-sm uppercase mb-4 tracking-wider">
          🔥 TOP 5 HIGH-IMPACT QUESTIONS (MOST UPVOTED)
        </h3>
        <div className="space-y-3 font-mono">
          {topQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="flex items-center justify-between p-3 border border-black dark:border-white bg-neutral-50 dark:bg-neutral-900"
            >
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center justify-center">
                  #{idx + 1}
                </span>
                <div>
                  <div className="font-sans font-semibold text-sm text-black dark:text-white line-clamp-1">
                    {q.content}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    Topic: {q.topicTag} | Author: {q.authorName}
                  </div>
                </div>
              </div>

              <div className="font-mono text-xs font-bold px-3 py-1 bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white">
                {q.upvotes} UPVOTES
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
