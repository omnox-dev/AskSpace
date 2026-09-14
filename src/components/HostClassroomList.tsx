import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Plus, 
  Search, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  Users, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Classroom, Question } from '@/types';

interface HostClassroomListProps {
  classrooms: Classroom[];
  questions: Question[];
  onSelectRoomAsHost: (room: Classroom) => void;
  onCreateRoom: (name: string, subject: string, hostName: string, pin: string) => void;
  onToggleLockRoom: (classroomId: string) => void;
  onDeleteRoom: (classroomId: string) => void;
}

export const HostClassroomList: React.FC<HostClassroomListProps> = ({
  classrooms,
  questions,
  onSelectRoomAsHost,
  onCreateRoom,
  onToggleLockRoom,
  onDeleteRoom,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'LOCKED'>('ALL');
  const [copiedRoomCode, setCopiedRoomCode] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Room Creation Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newHost, setNewHost] = useState('');
  const [newPin, setNewPin] = useState('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filtered Classrooms
  const filteredClassrooms = useMemo(() => {
    return classrooms.filter(room => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        room.name.toLowerCase().includes(q) ||
        room.code.toLowerCase().includes(q) ||
        room.subject.toLowerCase().includes(q) ||
        room.hostName.toLowerCase().includes(q);
      
      const matchesStatus = 
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && !room.isLocked) ||
        (statusFilter === 'LOCKED' && room.isLocked);

      return matchesSearch && matchesStatus;
    });
  }, [classrooms, searchQuery, statusFilter]);

  // High level overview metrics
  const totalQuestionsCount = questions.length;
  const totalPendingCount = questions.filter(q => q.status === 'pending').length;
  const totalStudentsCount = classrooms.reduce((acc, c) => acc + (c.activeStudents || 0), 0);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedRoomCode(code);
    triggerToast(`Room Code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedRoomCode(null), 2000);
  };

  const handleExportRoomCSV = (room: Classroom) => {
    const roomQs = questions.filter(q => q.classroomId === room.id);
    if (roomQs.length === 0) {
      triggerToast(`No questions to export for ${room.code}.`);
      return;
    }

    const headers = ['Question ID', 'Topic Tag', 'Question Content', 'Author', 'Upvotes', 'Status', 'Official Host Answer', 'Created At'];
    const rows = roomQs.map(q => [
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
    link.setAttribute('download', `${room.code}_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Exported CSV for classroom ${room.code}!`);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSubject.trim() || !newHost.trim() || !newPin.trim()) return;
    onCreateRoom(newName.trim(), newSubject.trim(), newHost.trim(), newPin.trim());
    setShowCreateModal(false);
    setNewName('');
    setNewSubject('');
    setNewHost('');
    setNewPin('');
    triggerToast('New classroom created successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-mono">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white px-5 py-3 shadow-sharp dark:shadow-sharp-white font-bold text-xs flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 sm:p-8 mb-8 shadow-sharp dark:shadow-sharp-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-black text-white dark:bg-white dark:text-black px-3 py-1 text-xs font-bold uppercase mb-3">
            <Shield className="w-4 h-4" />
            <span>Instructor Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black dark:text-white mb-2">
            HOST CLASSROOMS <span className="underline underline-offset-4">DASHBOARD</span>
          </h1>
          <p className="font-sans text-sm text-neutral-600 dark:text-neutral-300 max-w-xl">
            Manage your live classrooms, lock or unlock question submissions, export session Q&A data, and open individual room feeds.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold text-sm border-2 border-black dark:border-white hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center space-x-2 shadow-sharp-sm dark:shadow-sharp-sm-white whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>+ HOST NEW CLASSROOM</span>
        </button>
      </div>

      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-5 shadow-sharp-sm dark:shadow-sharp-sm-white">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase">Total Classrooms</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-black dark:text-white">{classrooms.length}</div>
        </div>

        <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-5 shadow-sharp-sm dark:shadow-sharp-sm-white">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase">Active Students</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-black dark:text-white">{totalStudentsCount}</div>
        </div>

        <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-5 shadow-sharp-sm dark:shadow-sharp-sm-white">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase">Total Questions</span>
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-black dark:text-white">{totalQuestionsCount}</div>
        </div>

        <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-5 shadow-sharp-sm dark:shadow-sharp-sm-white">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase">Pending Answers</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{totalPendingCount}</div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-black dark:border-white">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by room code, classroom name, subject or instructor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-black border border-black dark:border-white text-sm font-bold text-black dark:text-white focus:outline-none"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-bold uppercase text-neutral-500">Status:</span>
          <div className="flex border border-black dark:border-white bg-white dark:bg-black">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 font-bold ${statusFilter === 'ALL' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
            >
              All ({classrooms.length})
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1.5 font-bold ${statusFilter === 'ACTIVE' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
            >
              Open / Active
            </button>
            <button
              onClick={() => setStatusFilter('LOCKED')}
              className={`px-3 py-1.5 font-bold ${statusFilter === 'LOCKED' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
            >
              Locked
            </button>
          </div>
        </div>

      </div>

      {/* Classroom Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClassrooms.length === 0 ? (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-black dark:border-white p-8">
            <BookOpen className="w-12 h-12 mx-auto text-neutral-400 mb-3" />
            <h3 className="text-xl font-bold uppercase">No Classrooms Found</h3>
            <p className="font-sans text-sm text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
              {searchQuery ? 'No classrooms match your search query.' : 'Get started by creating your first hosted classroom.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase border border-black dark:border-white"
            >
              + Host New Classroom
            </button>
          </div>
        ) : (
          filteredClassrooms.map((room) => {
            const roomQs = questions.filter(q => q.classroomId === room.id);
            const pendingQs = roomQs.filter(q => q.status === 'pending');

            return (
              <div 
                key={room.id}
                className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 shadow-sharp dark:shadow-sharp-white hover:translate-y-[-2px] transition-transform flex flex-col justify-between"
              >
                <div>
                  {/* Card Top Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-black text-white dark:bg-white dark:text-black px-2.5 py-1 text-sm font-black tracking-wider border border-black dark:border-white">
                        {room.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(room.code)}
                        title="Copy Room Code"
                        className="p-1 border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                      >
                        {copiedRoomCode === room.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Lock Status Pill */}
                    <button
                      onClick={() => onToggleLockRoom(room.id)}
                      title={room.isLocked ? 'Click to Unlock Room' : 'Click to Lock Room'}
                      className={`px-2 py-0.5 text-[11px] font-bold uppercase border flex items-center space-x-1 ${
                        room.isLocked
                          ? 'bg-red-100 text-red-800 border-red-400 dark:bg-red-950 dark:text-red-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {room.isLocked ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>LOCKED</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3" />
                          <span>LIVE</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Title & Subject */}
                  <h3 className="text-xl font-black uppercase text-black dark:text-white leading-tight mb-1">
                    {room.name}
                  </h3>
                  <div className="text-xs font-semibold text-neutral-500 mb-4">
                    Subject: <span className="text-black dark:text-white font-bold">{room.subject}</span> • Host: <span className="text-black dark:text-white font-bold">{room.hostName}</span>
                  </div>

                  {/* Stats pill list */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-neutral-50 dark:bg-neutral-900 border border-black dark:border-white text-center text-xs mb-4">
                    <div>
                      <div className="text-neutral-500 font-bold uppercase text-[10px]">Students</div>
                      <div className="font-black text-sm text-black dark:text-white">{room.activeStudents}</div>
                    </div>
                    <div>
                      <div className="text-neutral-500 font-bold uppercase text-[10px]">Questions</div>
                      <div className="font-black text-sm text-black dark:text-white">{roomQs.length}</div>
                    </div>
                    <div>
                      <div className="text-neutral-500 font-bold uppercase text-[10px]">Pending</div>
                      <div className={`font-black text-sm ${pendingQs.length > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-black dark:text-white'}`}>
                        {pendingQs.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="space-y-2 pt-2 border-t border-black dark:border-white">
                  
                  {/* Primary Enter Button */}
                  <button
                    onClick={() => onSelectRoomAsHost(room)}
                    className="w-full py-2.5 bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase border-2 border-black dark:border-white hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>ENTER CLASSROOM FEED</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Quick Toolbar */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    
                    <button
                      onClick={() => handleExportRoomCSV(room)}
                      title="Export CSV"
                      className="px-2.5 py-1 border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900 font-bold flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>CSV</span>
                    </button>

                    <button
                      onClick={() => onToggleLockRoom(room.id)}
                      className="px-2.5 py-1 border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900 font-bold flex items-center space-x-1"
                    >
                      {room.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      <span>{room.isLocked ? 'Unlock' : 'Lock'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete classroom "${room.name}" (${room.code})? All associated questions will be removed.`)) {
                          onDeleteRoom(room.id);
                          triggerToast(`Deleted classroom ${room.code}`);
                        }
                      }}
                      title="Delete Classroom"
                      className="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 font-bold flex items-center space-x-1 border border-transparent hover:border-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal for Host New Classroom */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono">
          <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 max-w-lg w-full shadow-sharp dark:shadow-sharp-white space-y-4">
            <div className="flex justify-between items-center border-b-2 border-black dark:border-white pb-3">
              <h3 className="font-black text-xl uppercase flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Host New Private Classroom</span>
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="font-bold text-lg hover:opacity-75"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Classroom Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS401: Advanced Algorithms"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-black border-2 border-black dark:border-white font-bold text-sm text-black dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-black border-2 border-black dark:border-white font-bold text-sm text-black dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Instructor / Host Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. Vance"
                    value={newHost}
                    onChange={e => setNewHost(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-black border-2 border-black dark:border-white font-bold text-sm text-black dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Host Admin Secret PIN</label>
                <input
                  type="password"
                  required
                  placeholder="Secret PIN for room admin access"
                  value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-black border-2 border-black dark:border-white font-bold text-sm text-black dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold border border-black dark:border-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black font-bold text-xs uppercase border-2 border-black dark:border-white hover:opacity-90"
                >
                  CREATE CLASSROOM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
