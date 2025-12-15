
import React from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useGlobal } from '../../context/GlobalContext';

export const ToastContainer: React.FC = () => {
  const { notifications, removeToast } = useGlobal();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 md:right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
      {notifications.map((toast) => (
        <div 
          key={toast.id}
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border min-w-[300px] animate-in slide-in-from-right duration-300
            ${toast.type === 'success' ? 'bg-[#CCFFCE] border-[#B0F5B3] text-slate-800' : ''}
            ${toast.type === 'error' ? 'bg-[#FCB492] border-[#F59E7A] text-slate-900' : ''}
            ${toast.type === 'info' ? 'bg-white border-slate-200 text-slate-900' : ''}
          `}
        >
          <div className="shrink-0">
            {toast.type === 'success' && <CheckCircle2 size={20} className="text-green-700" />}
            {toast.type === 'error' && <AlertCircle size={20} className="text-[#7A2A00]" />}
            {toast.type === 'info' && <Info size={20} className="text-brand-navy" />}
          </div>
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100 transition-opacity">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
