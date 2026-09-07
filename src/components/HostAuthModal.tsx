import React, { useState } from 'react';
import { Shield, KeyRound } from 'lucide-react';
import { Classroom } from '@/types';

interface HostAuthModalProps {
  currentRoom: Classroom | null;
  onSuccessLogin: () => void;
  onClose: () => void;
}

export const HostAuthModal: React.FC<HostAuthModalProps> = ({
  currentRoom,
  onSuccessLogin,
  onClose,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoom) {
      setErrorMsg('No active classroom selected.');
      return;
    }

    const masterPassword = import.meta.env.VITE_HOST_ADMIN_PASSWORD || import.meta.env.VITE_HOST_ADMIN_PIN;
    const trimmedInput = pinInput.trim();

    if (
      trimmedInput === currentRoom.hostPin ||
      (masterPassword && trimmedInput === masterPassword)
    ) {
      onSuccessLogin();
      onClose();
    } else {
      setErrorMsg('Invalid Host Admin PIN or Master Password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono">
      <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-6 max-w-md w-full shadow-sharp dark:shadow-sharp-white space-y-4">
        
        <div className="flex justify-between items-center border-b-2 border-black dark:border-white pb-3">
          <div className="flex items-center space-x-2 font-bold text-lg uppercase">
            <Shield className="w-5 h-5" />
            <span>Host Administrator Login</span>
          </div>
          <button onClick={onClose} className="font-bold text-lg hover:opacity-75">✕</button>
        </div>

        <p className="text-xs font-sans text-neutral-600 dark:text-neutral-400">
          Enter the Host PIN for <strong>{currentRoom?.name || 'Classroom'}</strong> to manage questions, post official answers, and clear rooms.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Host Admin PIN</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="password"
                required
                placeholder="Enter Host PIN or Master Password"
                value={pinInput}
                onChange={e => {
                  setPinInput(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-black border-2 border-black dark:border-white text-sm font-bold text-black dark:text-white"
              />
            </div>
            {errorMsg && (
              <p className="text-[11px] text-red-600 dark:text-red-400 font-bold mt-1">
                ⚠️ {errorMsg}
              </p>
            )}
          </div>

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
              LOGIN AS HOST
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
