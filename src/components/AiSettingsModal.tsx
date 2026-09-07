import React, { useState } from 'react';
import { Settings, Sparkles, Check, Zap } from 'lucide-react';
import { AiProviderConfig } from '@/types';

interface AiSettingsModalProps {
  aiConfig: AiProviderConfig;
  onSaveConfig: (newConfig: AiProviderConfig) => void;
  onClose: () => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({
  aiConfig,
  onSaveConfig,
  onClose,
}) => {
  const [provider, setProvider] = useState<'groq' | 'gemini' | 'builtin'>(aiConfig.provider);
  const [groqKey, setGroqKey] = useState(aiConfig.groqApiKey || '');
  const [geminiKey, setGeminiKey] = useState(aiConfig.geminiApiKey || '');
  const [model, setModel] = useState(aiConfig.model || 'llama-3.3-70b-versatile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      provider,
      groqApiKey: groqKey.trim(),
      geminiApiKey: geminiKey.trim(),
      model,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono">
      <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 max-w-lg w-full shadow-sharp dark:shadow-sharp-white space-y-4">
        
        <div className="flex justify-between items-center border-b-2 border-black dark:border-white pb-3">
          <div className="flex items-center space-x-2 font-bold text-lg uppercase">
            <Settings className="w-5 h-5" />
            <span>AI Engine & API Settings</span>
          </div>
          <button onClick={onClose} className="font-bold text-lg hover:opacity-75">✕</button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Provider Selector */}
          <div>
            <label className="block text-xs font-bold uppercase mb-2">Select AI Provider</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setProvider('groq')}
                className={`p-3 border-2 font-bold text-xs text-left transition-all ${
                  provider === 'groq'
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sharp-sm dark:shadow-sharp-sm-white'
                    : 'border-neutral-300 dark:border-neutral-800'
                }`}
              >
                <div className="flex items-center space-x-1 mb-1">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>GROQ API</span>
                </div>
                <div className="text-[10px] opacity-80">Ultra High-Speed</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`p-3 border-2 font-bold text-xs text-left transition-all ${
                  provider === 'gemini'
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sharp-sm dark:shadow-sharp-sm-white'
                    : 'border-neutral-300 dark:border-neutral-800'
                }`}
              >
                <div className="flex items-center space-x-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>GEMINI API</span>
                </div>
                <div className="text-[10px] opacity-80">Deep Reasoning</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('builtin')}
                className={`p-3 border-2 font-bold text-xs text-left transition-all ${
                  provider === 'builtin'
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sharp-sm dark:shadow-sharp-sm-white'
                    : 'border-neutral-300 dark:border-neutral-800'
                }`}
              >
                <div className="flex items-center space-x-1 mb-1">
                  <span>⚙️ BUILT-IN</span>
                </div>
                <div className="text-[10px] opacity-80">Offline / Keyless</div>
              </button>
            </div>
          </div>

          {/* Provider Specific Inputs */}
          {provider === 'groq' && (
            <div className="p-4 border border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Groq API Key</label>
                <input
                  type="password"
                  placeholder="gsk_..."
                  value={groqKey}
                  onChange={e => setGroqKey(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white text-xs font-mono"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Get a free instant key at console.groq.com. Extremely fast!
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Model Selection</label>
                <select
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white text-xs font-mono"
                >
                  <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended)</option>
                  <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Fastest)</option>
                  <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
                </select>
              </div>
            </div>
          )}

          {provider === 'gemini' && (
            <div className="p-4 border border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Google Gemini API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={e => setGeminiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white text-xs font-mono"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Obtain free key from Google AI Studio (aistudio.google.com).
                </p>
              </div>
            </div>
          )}

          {provider === 'builtin' && (
            <div className="p-4 border border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 font-sans text-xs">
              <p className="font-mono font-bold uppercase text-black dark:text-white mb-1">Zero-Config Smart Fallback NLP</p>
              <p className="text-neutral-600 dark:text-neutral-400">
                Uses instant client-side keyword extraction, TF-IDF frequency scoring, and upvote weighting. No API key needed!
              </p>
            </div>
          )}

          {savedSuccess && (
            <div className="p-2 bg-black text-white dark:bg-white dark:text-black font-bold text-center text-xs">
              ✓ AI SETTINGS SAVED LOCALLY
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase border-2 border-black dark:border-white"
            >
              SAVE SETTINGS
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
