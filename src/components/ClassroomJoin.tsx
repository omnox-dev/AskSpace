import React, { useState } from 'react';
import { ArrowRight, Lock, Plus, Shield } from 'lucide-react';
import { Classroom } from '@/types';

interface ClassroomJoinProps {
  classrooms: Classroom[];
  onSelectRoom: (room: Classroom) => void;
  onCreateRoom: (name: string, subject: string, hostName: string, pin: string) => void;
}

export const ClassroomJoin: React.FC<ClassroomJoinProps> = ({
  classrooms,
  onSelectRoom,
  onCreateRoom,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  // New room state for Host
  const [newName, setNewName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newHost, setNewHost] = useState('');
  const [newPin, setNewPin] = useState('');

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const matched = classrooms.find(
      c => c.code.toLowerCase() === inputCode.trim().toLowerCase()
    );

    if (matched) {
      setErrorMsg('');
      onSelectRoom(matched);
    } else {
      setErrorMsg(`Invalid Classroom Code. Please check with your instructor for the code.`);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSubject.trim() || !newHost.trim() || !newPin.trim()) return;
    onCreateRoom(newName.trim(), newSubject.trim(), newHost.trim(), newPin.trim());
    setShowCreate(false);
    setNewName('');
    setNewSubject('');
    setNewHost('');
    setNewPin('');
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-1.5 border-2 border-black dark:border-white px-3 py-1 mb-4 font-mono text-xs uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>PRIVATE CLASSROOM ACCESS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-black dark:text-white uppercase mb-3">
          ENTER <span className="bg-black text-white dark:bg-white dark:text-black px-2 py-0.5">CLASSROOM</span>
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 font-sans">
          Enter the secret 6-digit code provided by your professor or instructor to join the live Q&A session.
        </p>
      </div>

      {/* Code Entry Card */}
      <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 sm:p-8 shadow-sharp dark:shadow-sharp-white mb-8">
        <form onSubmit={handleJoinByCode} className="space-y-4">
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-black dark:text-white">
            Classroom Code
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value.toUpperCase());
                  setErrorMsg('');
                }}
                placeholder="ENTER CODE (e.g. CS101)"
                maxLength={10}
                required
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-2 border-black dark:border-white text-black dark:text-white font-mono font-bold text-xl uppercase tracking-widest placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-base border-2 border-black dark:border-white hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2"
            >
              <span>JOIN ROOM</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs font-mono text-red-600 dark:text-red-400 font-bold">
              ⚠️ {errorMsg}
            </p>
          )}
        </form>
      </div>

      {/* Host / Instructor Section */}
      <div className="text-center border-t-2 border-black dark:border-white pt-6">
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="font-mono text-xs font-bold underline underline-offset-4 hover:opacity-75 uppercase text-neutral-700 dark:text-neutral-300 flex items-center justify-center space-x-1 mx-auto"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>{showCreate ? 'Close Host Portal' : 'Are you an Instructor? Create a Classroom'}</span>
        </button>

        {/* Instructor Room Creation Form */}
        {showCreate && (
          <form onSubmit={handleCreateSubmit} className="mt-6 text-left p-6 border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 space-y-4 shadow-sharp-sm dark:shadow-sharp-sm-white">
            <div className="font-mono font-bold text-sm uppercase flex items-center space-x-2 border-b border-black dark:border-white pb-2">
              <Plus className="w-4 h-4" />
              <span>Create New Private Classroom</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-semibold mb-1">Class Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Algorithms CS401"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white font-mono text-xs text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science"
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white font-mono text-xs text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-semibold mb-1">Host / Professor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Vance"
                  value={newHost}
                  onChange={e => setNewHost(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white font-mono text-xs text-black dark:text-white"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-semibold mb-1">Host Admin Secret PIN</label>
                <input
                  type="password"
                  required
                  placeholder="Secret PIN for host access"
                  value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-black border border-black dark:border-white font-mono text-xs text-black dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs uppercase border border-black dark:border-white hover:opacity-90 transition-opacity"
            >
              CREATE PRIVATE CLASSROOM NOW
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
