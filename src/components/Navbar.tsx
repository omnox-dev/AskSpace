import React from 'react';
import { Sparkles, BarChart2, Shield, Settings, HelpCircle, LogOut, PlusCircle, Sun, Moon } from 'lucide-react';
import { Classroom, AiProviderConfig } from '@/types';

interface NavbarProps {
  currentRoom: Classroom | null;
  activeTab: 'questions' | 'analytics' | 'ai-sets';
  setActiveTab: (tab: 'questions' | 'analytics' | 'ai-sets') => void;
  isHostLoggedIn: boolean;
  onOpenHostAuth: () => void;
  onHostLogout: () => void;
  onOpenAiSettings: () => void;
  onOpenNewRoomModal: () => void;
  aiConfig: AiProviderConfig;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoom,
  activeTab,
  setActiveTab,
  isHostLoggedIn,
  onOpenHostAuth,
  onHostLogout,
  onOpenAiSettings,
  onOpenNewRoomModal,
  aiConfig,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-black border-b-2 border-black dark:border-white text-black dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Room Badge */}
        <div className="flex items-center space-x-4">
          <div 
            onClick={() => setActiveTab('questions')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-mono font-black text-xl border border-black dark:border-white shadow-sharp-sm dark:shadow-sharp-sm-white group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
              ?
            </div>
            <span className="font-mono font-black tracking-tight text-xl">
              ASK<span className="underline underline-offset-4 decoration-2">SPACE</span>
            </span>
          </div>

          {currentRoom && (
            <div className="hidden md:flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-900 border border-black dark:border-white px-3 py-1 text-xs font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold">{currentRoom.code}</span>
              <span className="text-neutral-500 dark:text-neutral-400">| {currentRoom.name}</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs - STRICT RBAC: Students only see Questions. Host sees AI Sets & Analytics */}
        {currentRoom && (
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-mono font-semibold border transition-all ${
                activeTab === 'questions'
                  ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sharp-sm dark:shadow-sharp-sm-white'
                  : 'bg-transparent text-black dark:text-white border-transparent hover:border-black dark:hover:border-white'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Questions</span>
              </span>
            </button>

            {/* ONLY DISPLAY AI SETS AND ANALYTICS TO AUTHENTICATED HOSTS */}
            {isHostLoggedIn && (
              <>
                <button
                  onClick={() => setActiveTab('ai-sets')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-mono font-semibold border transition-all ${
                    activeTab === 'ai-sets'
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sharp-sm dark:shadow-sharp-sm-white'
                      : 'bg-transparent text-black dark:text-white border-transparent hover:border-black dark:hover:border-white'
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Sets</span>
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-mono font-semibold border transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sharp-sm dark:shadow-sharp-sm-white'
                      : 'bg-transparent text-black dark:text-white border-transparent hover:border-black dark:hover:border-white'
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    <BarChart2 className="w-4 h-4" />
                    <span>Analytics</span>
                  </span>
                </button>
              </>
            )}
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            className="p-1.5 text-xs font-mono border border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-black" />
            ) : (
              <Sun className="w-4 h-4 text-white" />
            )}
          </button>

          {/* AI Settings Indicator (Host only) */}
          {isHostLoggedIn && (
            <button
              onClick={onOpenAiSettings}
              title={`AI Engine: ${aiConfig.provider.toUpperCase()}`}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-mono border border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-bold uppercase">{aiConfig.provider}</span>
            </button>
          )}

          {/* Host Login / Auth */}
          {isHostLoggedIn ? (
            <div className="flex items-center space-x-1 border border-black dark:border-white px-2.5 py-1.5 text-xs font-mono bg-black text-white dark:bg-white dark:text-black">
              <Shield className="w-3.5 h-3.5" />
              <span className="font-bold hidden sm:inline">HOST</span>
              <button 
                onClick={onHostLogout} 
                className="ml-1 hover:opacity-75"
                title="Logout Host Mode"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenHostAuth}
              className="px-3 py-1.5 text-xs font-mono font-bold border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
            >
              Host Login
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
