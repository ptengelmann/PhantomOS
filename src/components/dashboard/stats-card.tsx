'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatCompactNumber, formatPercentage } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changePeriod?: string;
  icon?: React.ReactNode;
  format?: 'number' | 'currency' | 'percentage' | 'none';
}

export function StatsCard({
  title,
  value,
  change,
  changePeriod = 'vs last period',
  icon,
  format = 'none'
}: StatsCardProps) {
  const formattedValue = typeof value === 'number' && format === 'number'
    ? formatCompactNumber(value)
    : value;

  const getTrendIcon = () => {
    if (change === undefined || change === 0) {
      return <Minus className="w-3 h-3" />;
    }
    return change > 0
      ? <TrendingUp className="w-3 h-3" />
      : <TrendingDown className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (change === undefined || change === 0) return 'text-[#737373]';
    return change > 0 ? 'text-[#22c55e]' : 'text-[#ef4444]';
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#737373] mb-1">{title}</p>
          <p className="text-2xl font-semibold text-[#0a0a0a] tracking-tight">{formattedValue}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{formatPercentage(change)}</span>
              <span className="text-[#a3a3a3] ml-1">{changePeriod}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center text-[#737373]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
