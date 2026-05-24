import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-slate-800 border border-slate-700 rounded-lg shadow-sm p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <p className="text-2xl font-semibold text-white mt-1">{value}</p>
      </div>
      {icon && <div className="text-sky-400 text-2xl">{icon}</div>}
    </Card>
  );
}
