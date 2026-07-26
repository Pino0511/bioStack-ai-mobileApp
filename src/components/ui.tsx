import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useDarkMode } from './darkMode';

export function useCardClass() {
  const { dark } = useDarkMode();
  return dark
    ? 'bg-night-800 border border-night-700/60'
    : 'bg-white border border-night-100';
}

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const base = useCardClass();
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl ${base} shadow-card ${className} ${onClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''}`}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'amber';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}) {
  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-br from-sage-500 to-sage-600 text-white shadow-lg shadow-sage-500/25 hover:from-sage-600 hover:to-sage-700',
    secondary: 'bg-night-100 dark:bg-night-700 text-night-900 dark:text-white hover:bg-night-200 dark:hover:bg-night-600',
    ghost: 'bg-transparent text-night-600 dark:text-night-300 hover:bg-night-100 dark:hover:bg-night-700',
    amber:
      'bg-gradient-to-br from-amber-400 to-amber-500 text-night-900 shadow-lg shadow-amber-500/25 hover:from-amber-500 hover:to-amber-600',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
}

export function ProgressRing({
  value,
  size = 80,
  stroke = 8,
  color = '#0d9488',
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: ReactNode;
}) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (circ * Math.max(0, Math.min(100, value))) / 100;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-night-200 dark:text-night-700"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

export function Chip({
  children,
  active,
  onClick,
  className = '',
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${
        active
          ? 'bg-sage-500 text-white shadow-sm shadow-sage-500/30'
          : 'bg-night-100 dark:bg-night-800 text-night-600 dark:text-night-300'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-night-200 dark:bg-night-700 ${className}`} />;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  const { dark } = useDarkMode();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${dark ? 'bg-night-800' : 'bg-night-100'}`}>
        {icon}
      </div>
      <p className={`font-semibold mb-1 ${dark ? 'text-white' : 'text-night-900'}`}>{title}</p>
      <p className={`text-sm mb-4 ${dark ? 'text-night-400' : 'text-night-500'}`}>{subtitle}</p>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <p className="text-sm text-red-500 mb-3">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm font-medium text-sage-600 dark:text-sage-400">
          Riprova
        </button>
      )}
    </div>
  );
}
