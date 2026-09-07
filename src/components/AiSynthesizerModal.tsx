import React, { useState } from 'react';
import { Sparkles, Brain, Download, Copy, Check, FileText, BarChart, ChevronDown, ChevronUp } from 'lucide-react';
import { AiQuestionSet, Question, AiProviderConfig } from '@/types';
import { analyzeQuestionsWithAI } from '@/lib/ai';

interface AiSynthesizerModalProps {
  currentRoomId: string;
  questions: Question[];
  aiSets: AiQuestionSet[];
  onSaveNewSet: (newSet: AiQuestionSet) => void;
  aiConfig: AiProviderConfig;
  onOpenAiSettings: () => void;
}

export const AiSynthesizerModal: React.FC<AiSynthesizerModalProps> = ({
  currentRoomId,
  questions,
  aiSets,
  onSaveNewSet,
  aiConfig,
  onOpenAiSettings,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSet, setSelectedSet] = useState<AiQuestionSet | null>(aiSets[0] || null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const roomSets = aiSets.filter(s => s.classroomId === currentRoomId);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const roomQuestions = questions.filter(q => q.classroomId === currentRoomId);
      const newSet = await analyzeQuestionsWithAI(currentRoomId, roomQuestions, aiConfig);
      onSaveNewSet(newSet);
      setSelectedSet(newSet);
    } catch (err) {
      console.error('Error generating AI set:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!selectedSet) return;
    let md = `# ${selectedSet.title}\n\n`;
    md += `*${selectedSet.summary}*\n\n`;
    md += `## Top Student Confusions:\n`;
    selectedSet.topConfusions.forEach(c => md += `- ${c}\n`);
    md += `\n## Curated Exam/Review Questions:\n\n`;

    selectedSet.items.forEach((item, i) => {
      md += `### Q${i + 1}: ${item.synthesizedQuestion} (${item.topic} - ${item.difficulty})\n`;
      md += `**Rationale**: ${item.explanation}\n\n`;
      md += `**Sample Answer**: ${item.sampleAnswer}\n\n`;
      md += `---\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 mb-8 shadow-sharp dark:shadow-sharp-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs uppercase flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 inline" />
              <span>AI QUESTION SYNTHESIZER</span>
            </span>
            <span className="font-mono text-xs text-neutral-500 font-semibold">
              Engine: <strong className="uppercase">{aiConfig.provider}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono text-black dark:text-white uppercase tracking-tight">
            Curated AI Question Sets
          </h1>
          <p className="text-sm font-sans text-neutral-600 dark:text-neutral-400 mt-1">
            Aggregates raw student inquiries into structured practice sets, model answers, and confusion maps.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenAiSettings}
            className="px-3 py-2 border border-black dark:border-white font-mono text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            Config AI Key
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-sm border-2 border-black dark:border-white hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center space-x-2 shadow-sharp-sm dark:shadow-sharp-sm-white disabled:opacity-50"
          >
            <Brain className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'ANALYZING QUESTIONS...' : 'GENERATE NEW SET'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Set History Picker */}
        <div className="lg:col-span-1 border-2 border-black dark:border-white p-4 bg-white dark:bg-black">
          <h3 className="font-mono font-bold text-xs uppercase border-b-2 border-black dark:border-white pb-2 mb-3">
            Generated Sets ({roomSets.length})
          </h3>
          <div className="space-y-2">
            {roomSets.length === 0 ? (
              <p className="font-mono text-xs text-neutral-500 py-4 text-center">No AI sets created yet.</p>
            ) : (
              roomSets.map((set) => (
                <div
                  key={set.id}
                  onClick={() => setSelectedSet(set)}
                  className={`p-3 border font-mono text-xs cursor-pointer transition-all ${
                    selectedSet?.id === set.id
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold shadow-sharp-sm dark:shadow-sharp-sm-white'
                      : 'border-neutral-300 dark:border-neutral-800 hover:border-black dark:hover:border-white'
                  }`}
                >
                  <div className="truncate font-bold mb-1">{set.title}</div>
                  <div className="text-[10px] opacity-75 flex justify-between">
                    <span>{set.items.length} Questions</span>
                    <span>{new Date(set.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Selected AI Question Set Details */}
        <div className="lg:col-span-3">
          {selectedSet ? (
            <div className="space-y-6">
              
              {/* Header Box & Export Buttons */}
              <div className="border-2 border-black dark:border-white p-6 bg-white dark:bg-black shadow-sharp dark:shadow-sharp-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                  <h2 className="font-mono font-black text-xl uppercase">{selectedSet.title}</h2>
                  <button
                    onClick={handleCopyMarkdown}
                    className="px-4 py-1.5 border-2 border-black dark:border-white font-mono font-bold text-xs flex items-center space-x-1.5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  >
                    {copiedMarkdown ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>COPIED TO CLIPBOARD</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>EXPORT MARKDOWN</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="font-sans text-sm text-neutral-700 dark:text-neutral-300 mb-4 italic">
                  "{selectedSet.summary}"
                </p>

                {/* Top Confusions */}
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-black dark:border-white">
                  <h4 className="font-mono font-bold text-xs uppercase mb-2">⚡ Key Student Confusion Areas:</h4>
                  <ul className="space-y-1 font-mono text-xs">
                    {selectedSet.topConfusions.map((c, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-black dark:text-white">
                  Curated Practice Questions ({selectedSet.items.length})
                </h3>

                {selectedSet.items.map((item, index) => {
                  const isExpanded = expandedItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="border-2 border-black dark:border-white bg-white dark:bg-black p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center justify-center">
                            Q{index + 1}
                          </span>
                          <span className="px-2 py-0.5 border border-black dark:border-white font-mono text-xs font-bold uppercase">
                            {item.topic}
                          </span>
                          <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-900 font-mono text-xs font-bold">
                            {item.difficulty}
                          </span>
                        </div>

                        <div className="font-mono text-xs font-bold flex items-center space-x-2">
                          <span>Relevance Score: {item.frequencyScore}%</span>
                        </div>
                      </div>

                      <h4 className="font-sans font-bold text-lg text-black dark:text-white mb-2">
                        {item.synthesizedQuestion}
                      </h4>

                      <p className="font-sans text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                        <strong>Rationale:</strong> {item.explanation}
                      </p>

                      {/* Expandable Model Answer */}
                      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
                        <button
                          onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                          className="font-mono font-bold text-xs flex items-center space-x-1.5 text-black dark:text-white underline"
                        >
                          <span>{isExpanded ? 'Hide Model Answer' : 'Show AI Model Answer'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {isExpanded && (
                          <div className="mt-3 p-4 bg-neutral-50 dark:bg-neutral-950 border-l-4 border-black dark:border-white font-sans text-sm">
                            <div className="font-mono font-bold text-xs uppercase mb-1">Model Solution & Explanation</div>
                            <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
                              {item.sampleAnswer}
                            </p>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-black dark:border-white p-8">
              <Brain className="w-12 h-12 mx-auto text-neutral-400 mb-3" />
              <h3 className="font-mono font-bold text-lg uppercase">Select or Generate an AI Set</h3>
              <p className="text-sm font-sans text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
                Click "GENERATE NEW SET" to analyze the latest student questions.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
