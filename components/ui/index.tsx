import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card = ({ children, className = '', title }: CardProps) => (
  <div className={`bg-white rounded-lg border border-slate-100 p-6 md:p-8 relative overflow-hidden ${className}`}>
    {title && <h3 className="text-xl font-black text-slate-800 mb-6 tracking-tight">{title}</h3>}
    {children}
  </div>
);

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  trend?: string;
}

export const StatCard = ({ label, value, icon, color = 'blue', trend }: StatCardProps) => {
  const getColors = () => {
    switch(color) {
      case 'green': return 'bg-emerald-50 text-emerald-600 ring-emerald-100';
      case 'purple': return 'bg-purple-50 text-purple-600 ring-purple-100';
      case 'orange': return 'bg-orange-50 text-orange-600 ring-orange-100';
      default: return 'bg-indigo-50 text-indigo-600 ring-indigo-100';
    }
  };

  return (
    <Card className="flex flex-col gap-3 group hover:scale-[1.02] transition-transform duration-300">
      <div className="flex justify-between items-start">
        <div className={`p-3.5 rounded-lg ${getColors()}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </Card>
  );
};

export const ProgressBar = ({ progress, label }: { progress: number, label?: string }) => (
  <div className="w-full">
    <div className="flex justify-between items-end mb-3">
      {label && <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>}
      <span className="text-lg font-black text-indigo-600">{Math.min(100, Math.round(progress))}%</span>
    </div>
    <div className="w-full bg-slate-100 rounded-lg h-4 p-[2px] border border-slate-200/50">
      <div 
        className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full rounded-[4px] transition-all duration-1000 ease-out"
        style={{ width: `${Math.min(100, progress)}%` }}
      />
    </div>
  </div>
);

export const Button = ({ children, type = 'button', onClick, className = '', variant = 'primary', disabled = false }: any) => {
  const variants: any = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-95',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 rounded-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg font-bold tracking-tight transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = React.forwardRef(({ label, error, ...props }: any, ref: any) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
    <input
      {...props}
      ref={ref}
      className={`px-5 py-3.5 bg-slate-50 border rounded-lg focus:outline-none focus:border-indigo-500/50 transition-all text-slate-900 font-medium placeholder:text-slate-300 ${
        error ? 'border-red-300 focus:border-red-400' : 'border-slate-200'
      }`}
    />
    {error && <span className="text-[10px] font-bold text-red-500 ml-1">{error}</span>}
  </div>
));

Input.displayName = 'Input';

export const Select = React.forwardRef(({ label, error, options, ...props }: any, ref: any) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
    <select
      {...props}
      ref={ref}
      className={`px-5 py-3.5 bg-slate-50 border rounded-lg focus:outline-none focus:border-indigo-500/50 transition-all text-slate-900 font-medium appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.25rem_1.25rem] ${
        error ? 'border-red-300 focus:border-red-400' : 'border-slate-200'
      }`}
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <span className="text-[10px] font-bold text-red-500 ml-1">{error}</span>}
  </div>
));

Select.displayName = 'Select';

export const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-lg p-8 relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {title && <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">{title}</h3>}
        {children}
      </div>
    </div>
  );
};

