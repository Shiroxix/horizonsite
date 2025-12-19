import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon: Icon, error, className = '', ...props }) => {
  return (
    <div className="mb-4 space-y-1.5">
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brawl-blue transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`w-full bg-[#0A0B14] border border-white/10 rounded-xl py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brawl-blue focus:ring-1 focus:ring-brawl-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed ${Icon ? 'pl-10 pr-4' : 'px-4'} ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-400 text-xs ml-1">{error}</p>}
    </div>
  );
};